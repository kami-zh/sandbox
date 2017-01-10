class Article < ApplicationRecord
  include Elasticsearch::Model
  include Elasticsearch::Model::Callbacks

  settings do
    mappings dynamic: 'false' do # デフォでマッピングが自動生成されるのでオフに
      indexes :title, type: 'string', analyzer: 'kuromoji' # stringがデフォルト値
      indexes :content, type: 'string', analyzer: 'kuromoji'
    end
  end

  def more_like_this
    self.class.__elasticsearch__.search({
      query: {
        more_like_this: {
          fields: %w(title content),
          ids: [id],
          min_doc_freq: 0,
          min_term_freq: 0
        }
      }
    })
  end

  class << self
    def search(query)
      __elasticsearch__.search({
        query: {
          multi_match: {
            query: query,
            fields: %w(title content),
            fuzziness: 'AUTO'
          }
        }
      })
    end
  end
end
