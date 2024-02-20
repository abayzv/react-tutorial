import './App.css'
import Layout from './layouts'
import { KanbanProvider } from './stores/kanban'
import Kanban from './components/kanban';

function App() {
  return (
    <Layout>
      <KanbanProvider>
        <Kanban />
      </KanbanProvider>
    </Layout>
  )
}

export default App
