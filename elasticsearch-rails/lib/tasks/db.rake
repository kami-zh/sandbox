namespace :db do
  desc 'Populate with sample data'
  task populate: :environment do
    include ActionView::Helpers::SanitizeHelper

    feed = Feedjira::Feed.fetch_and_parse('http://post.simplie.jp/feed')
    feed.entries.each do |entry|
      if Article.exists?(title: entry.title)
        break
      end
      Article.create!(
        title: entry.title,
        content: strip_tags(entry.summary)
      )
      puts "Create an article: #{entry.title}"
    end
  end
end
