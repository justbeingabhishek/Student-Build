import PostForm from "../components/user/PostForm"


const Post = () => {
  return (
    <div className="h-full w-full flex py-5 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Post</h2>
      </div>
      <div className="flex items-center flex-col gap-8">
        <PostForm/>
      </div>
    </div>
  )
}

export default Post