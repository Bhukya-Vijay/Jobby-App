import {Route, Switch, Redirect} from 'react-router-dom'
import './App.css'
import Login from './Components/Login'
import Home from './Components/Home'
import Assessment from './Components/AssessmentPage'
import Results from './Components/Results'
import NotFound from './Components/NotFound'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/" component={Home} />
    <Route exact path="/assessment" component={Assessment} />
    <Route exact path="/results" component={Results} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
