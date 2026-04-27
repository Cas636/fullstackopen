import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  return (
    <div className="notification">
      {notification}
    </div>
  )
}

export default Notification
