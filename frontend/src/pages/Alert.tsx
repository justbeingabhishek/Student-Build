import Notification from "../components/user/Notification"

const Alert = () => {
  return (
    <div className="h-full w-full flex py-5 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">Notifications</h2>
      </div>
      <div className="flex items-center flex-col gap-4">
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
            <Notification/>
      </div>
    </div>
  )
}

export default Alert