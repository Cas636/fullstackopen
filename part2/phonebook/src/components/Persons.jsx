const Persons = ({ personsToDisplay, deletePerson }) => (
  <div>
    {personsToDisplay.map(person => (
      <div key={person.id}>
        {person.name} {person.number} 
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </div>
    ))}
  </div>
)

export default Persons
