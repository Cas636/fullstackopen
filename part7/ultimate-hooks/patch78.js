const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

const oldHook = `const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  // ...

  const create = (resource) => {
    // ...
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}`;

const newHook = `const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    }).catch(err => {
      console.error(err)
    })
  }, [baseUrl])

  const create = async (resource) => {
    try {
      const response = await axios.post(baseUrl, resource)
      setResources(resources.concat(response.data))
    } catch(err) {
      console.error(err)
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}`;

fs.writeFileSync('src/App.jsx', code.replace(oldHook, newHook));
console.log('useResource replaced!');
