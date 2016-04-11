---
layout: post
title: "Adding a Simple Anti Spam Question to FunnelWeb"
meta-description: ""
tags: ["funnelweb","spam"]
categories: ["funnelweb"]
migrated: "true"
permalink: "/funnelweb/add-simple-anti-spam-question/"
---
I've been getting a ridiculous amount of spam on my blog and even though [FunnelWeb][1] checks with [akismet][2], a lot of spam messages are still getting through. Most spam comments are placed by bots that look for input fields and then submit garbage in hopes that it somehow becomes a link. We can make it a little harder for it by including a simple question that humans can easily answer, which should reduce amount of spam. 

It was very easy to do in FunnelWeb since it embraces ASP.NET MVC. All I had to do is to create an extra property in the `PageModel` model and annotate it with regular expression validation that looks for the key answer to the question I've provided. (?i) in the regular expression annotation means case insensitive comparison.
 
    [Required]
    [StringLength(50)]
    [DisplayName("Spam check")]
    [HintSize((HintSize.Medium))]
    [Description("What colour is grass?")]
    [RegularExpression("(?i)^green$", ErrorMessage = "Please confirm that you are human and enter a correct answer. What colour is grass?")]
    public string SpamCheck { get; set; }

We don't add any extra code in our controllers since it already checks if model is valid and if not it would return back with validation error messages. One more thing we need to do is to modify our view to display the spam check answer. We customize our views in the FunnelWeb by coping them into our themes folder and then making changes there keeping originals intact. So I've copied **_EditComments.cshtml** from Views/Shared folder and placed under my Theme folder in the Views/Shared folder and added the following to display the spam check. 

    <div class="editor-label">
        @Html.LabelFor(m => m.SpamCheck)
    </div>
    <div class="editor-field">
        @Html.EditorFor(m => m.SpamCheck, Html.AttributesFor(m => m.SpamCheck))
        @Html.ValidationMessageFor(m => m.SpamCheck)
        @Html.HintFor(m => m.SpamCheck)
    </div>

And that's it, with minimal modification to our blogging platform we eliminated all those annoying spam bots posting garbage. 

#### Update 11-26-12
Since putting up that spam filter I haven't gotten a single spam comment in last 24 hours. Nice, no more need to administer your comments daily, one less thing to worry about!

  [1]: http://funnelweblog.com/
  [2]: http://akismet.com/