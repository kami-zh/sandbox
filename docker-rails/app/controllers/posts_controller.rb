class PostsController < ApplicationController
  def show
    @post = Post.find(params[:id])
    @post.views.increment
  end
end
