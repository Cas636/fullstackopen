const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </>

const Course = ({ course }) => {
  const sum = course.parts.reduce((s, p) => s + p.exercises, 0)
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total sum={sum} />
    </div>
  )
}

export default Course
