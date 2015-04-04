blog
====

blog.maskalik.com generated with Jekyll and published via Github pages


This is my personal blog generated with Jekyll and published to Amazon S3 and MAXCDN. 


Blog content licensed under the Creative Commons http://creativecommons.org/licenses/by/2.5/


### Run it locally

```shell
bundler exec jekyll serve
```

### Testing

[HTML::Proofer](https://github.com/gjtorikian/html-proofer) is set up to validate all links within the project.  You can run this locally to ensure that your changes are valid:

```shell
bundle install
bundle exec rake test
```