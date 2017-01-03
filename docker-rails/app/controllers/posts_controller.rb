class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])
    @post.increment_view
  end
end
