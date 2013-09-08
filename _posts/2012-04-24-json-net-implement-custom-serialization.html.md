---
title: "JSON.NET Implementing Custom Serialization"
meta-description: ""
meta-keywords: ""
publish-date: "2012-04-24"
tags: ["asp.net","json.net","serialization"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/json-net-implement-custom-serialization"
---
JSON.NET is a great library for serializing objects to and from json strings. In case you need to have a more control of how your object is being serialized this post covers creation of custom json converter. For instance, I came across a scenario where a json result had to have a property name starting with a $(dollar sign) like "$and" and as you may guess properties in .NET cannot start with a dollar sign. So that's where we would need a custom json converter.

#Setup

First thing you need to do is to create a custom class the derives from JsonConverter, and override 3 methods. In the CanConvert method we check if the passed in type can be assigned to our target type WierdName.

    public class WierdNameSerializer : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(WierdName).IsAssignableFrom(objectType);
        }
    }


Next is you need to decorate your class which will be serialized with the attribute of a newly created type

    [JsonConverter(typeof(WierdNameSerializer))]
    public class WierdName
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

#Custom Writing

Now in your WriteJson method we will cast the value object to your serilized class so we can access properties and do our custom serialization on them.

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        var name = value as WierdName;
        writer.WriteStartObject();
        writer.WritePropertyName("$" + name.Name);
        serializer.Serialize(writer, name.Value);
        writer.WriteEndObject();
    }

You can also nest objects within other objects

        var name = value as WierdName;
        writer.WriteStartObject();
        writer.WritePropertyName("$" + name.Name);
        writer.WriteStartObject();
        writer.WritePropertyName("nested");
        serializer.Serialize(writer, name.Value);
        writer.WriteEndObject();
        writer.WriteEndObject();

#Custom Reading

First thing is you need to load the json reader into a JObject. Then you can access fields if you know the key of the property with jsonObject["fieldName"]. If the schema is the same you can use 

    var name = new WierdName(); 
    serializer.Populate(jObject.CreateReader(), name); 

to populate properties automatically. However in our case our property name is not standard so we'll have to manually get it from list of properties. 

    public override object ReadJson(JsonReader reader, Type objectType, 
    object existingValue, JsonSerializer serializer)
    {
        JObject jsonObject = JObject.Load(reader);
        var properties = jsonObject.Properties().ToList();    
        return new WierdName { 
                               Name = properties[0].Name.Replace("$",""), 
                               Value = (string)properties[0].Value 
                             };
    }

#Testing our custom serializer

    // Arrange
    var wierd = new WierdName {Name = "first", Value = "Sergey"};

    // Act
    // wierd gets serialized into "{\"$first\":\"Sergey\"}"
    var result = JsonConvert.SerializeObject(wierd); 

    var test = JsonConvert.DeserializeObject<WierdName>(result);

    // Assert
    Assert.AreEqual(wierd.Name,test.Name);
    Assert.AreEqual(wierd.Value,test.Value);

And that's it, now you should have an idea of how to implement custom json serializers. Please post if you have any questions. 