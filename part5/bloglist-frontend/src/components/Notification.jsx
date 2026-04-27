import { Alert } from 'react-bootstrap'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert variant={type === 'error' ? 'danger' : 'success'}>
      {message}
    </Alert>
  )
}

export default Notification