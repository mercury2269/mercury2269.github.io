---
layout: post
title: "Entity Framework An Object With The Same Key Already Exists"
meta-description: ""
meta-keywords: ""
categories: 
  - entity-framework
tags:
  - c#
  - 
---

Detached objects, or objects that are created outside of Entity Framework(EF), don't have automatic tracking enabled, and updating database from detached objects is not hard but requires extra knowledge of EF. With this post I'd like to spell out different ways of doing it.

First you must learn that there is a **DbContext.Entry<TEntity\>** method. It returns a DbEntityEntry<TEntity\> that
provides access to information about the entity and the ability to perform actions on the entity.

To see if your object is detached, you pass your entity to that method and then from result you can check the state of your object: 

	var entry = _context.Entry<T>(entity);
	Debug.Write(entry.State) // returnes EntityState.Detached

If your object is in any state other than EntityState.Detached, that means EF knows about it and tracks it, so you don't need to do anything else, DbContext.SaveChanges() would take care of everything.

Since the object is in the detached state, the first mistake that I made is to think that I can just simply attach it and set it to be modified.

	public override void Update(T entity)
	{
		var entry = _context.Entry<T>(entity);
		
		if (entry.State == EntityState.Detached)
		{
		    _context.Set<T>().Attach(entity);
		    entry.State = EntityState.Modified;
		}
	}

And that would work, but only if the object with the same key is not already present in the context. And when it does, you get a nice error:

> An object with the same key already exists in the ObjectStateManager. The ObjectStateManager cannot track multiple objects with the same key. 

So what do you do when an object is already being tracked by EF and you have a detached object, how do you merge them together? 

Fortunately, EF does provide a way to update an existing object from a detached object. It's a little different depending on the context and what you know about your object. Here are two ways you can do that:

##Quering Database First And Updating Tracked Object

	using(var db = new StoreDbContext()) 
	{
		var existingCart = db.Carts.Find(cartId);
		if(existingCart != null)
		{
			//entity is already in the context
			var attachedEntry = db.Entry(existingCart);
		    attachedEntry.CurrentValues.SetValues(newCart);
		}
		else
		{
			//Since we don't have it in db, this is a simple add.
			db.Cart.Add(newCart);
		}
	}

After querying a database and finding a record, we know that EF is already tracking the object. We then get an entry of the tracked entity and call attachedEntry.CurrentValues.SetValues to update it with new values. This method works like an auto mapper and updates scalar properties from the passed in object. Also if the property value is different from the original, it sets the property state to be modified. 

***So in the scenario when an object exists in the database and context, to update, rather than attaching detached object we get tracked existing object and set it's properties from the detached object.***

That works, but requires an extra database call to get an existing record. There is also a way to do that without an extra query.

##Not Performing An Extra Database Call And Checking Local Context

There are times when you know for fact an entity is already in the database. An example would be when an id of your object that's auto generated from database is not set to zero or default. In that situation you can save an extra call by querying the local context first. If an entity does exist in the local context you perform a similar update with attachedEntry.CurrentValues.SetValues and if it doesn't you can modify a state of your detached object to modified, which would attach the object and update the database. 

For example, when I know that the cart id is not zero, that means it already exists in the database:

	if(newCart.Id > 0) // Id already assigned, need to update.
	{
		//We query local context first to see if it's there.
		var attachedEntity = db.Carts.Local.Find(newCart.Id);
		
		//We have it in the context, need to update.
		if (attachedEntity != null) {
		    var attachedEntry = _context.Entry(attachedEntity);
		    attachedEntry.CurrentValues.SetValues(newCart);
	 	}
		else 
		{
			//If it's not found locally, we can attach it by setting state to modified.
			//This would result in a full update statement when SaveChanges is called. 
			var entry = db.Entry(newCart);
			entry.State = EntityState.Modified;
		}
	}
	else 
	{
		//This is a simple add since we don't have it in db.
		db.Cart.Add(newCart);
	}

There is a small difference when you query the database first. EF knows which values have been modified an only those specific value. On the other hand, when you are blindly attaching modified entity, EF doesn't know what fields have changes and performs an update on all fields. 

##It Works, But Not Fully...

When you call CurrentValues.SetValues(newCart) it will update all scalar properties on your newCart object and set them to modified. However, navigation properties would not get the same respect. As of today EF does not support of full object graph merging, and leaves that for you to manage on your own. So if you have newCart.Customer navigational property it would not get updated. It's [the second most requested feature](https://entityframework.codeplex.com/workitem/864) for EF at the moment, so I think they would add it in the future release.

So for now you have to manually SetValues on all your navigational properties in order for them to be updated. There are also [other solutions](https://github.com/refactorthis/GraphDiff) that people have written that might help with updating a full graph that I haven't tried.

Finally, if you object graph is not very large, you can get away with getting DbEntityEntry and calling SetValues on each navigational property. But if you do have a large graph and want something automatic I would try something like GraphDiff first. 

