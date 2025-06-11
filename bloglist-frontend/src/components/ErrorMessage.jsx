const ErrorMessage = ({ message }) => {
  const errorStyle = {
    color: 'red',
    fontSize: 16,
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (!message) {
    return null
  }

  return (
    <div style={errorStyle} className="error">
      {message}
    </div>
  )
}

export default ErrorMessage