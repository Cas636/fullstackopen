import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(filterChange(event.target.value))
  }

  return (
    <div className="filter-container">
      filter <input onChange={handleChange} placeholder="Search anecdotes..." />
    </div>
  )
}

export default Filter