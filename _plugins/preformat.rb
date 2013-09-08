module Jekyll
  module MarkdownFilter
    def asset_text(input)
      "hello"
    end 
  end
end

Liquid::Template.register_filter(Jekyll::MarkdownFilter)