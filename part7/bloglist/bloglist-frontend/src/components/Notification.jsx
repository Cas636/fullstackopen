import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification || !notification.message) {
    return null
  }

  const notificationStyle = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={notificationStyle}>{notification.message}</div>
}

export default Notification
