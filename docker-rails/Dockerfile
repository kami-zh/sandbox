FROM ruby:2.3.3
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /app
WORKDIR /app
ADD Gemfile Gemfile
ADD Gemfile.lock Gemfile.lock
ENV BUNDLE_PATH=/bundle
RUN bundle install
ADD . .
