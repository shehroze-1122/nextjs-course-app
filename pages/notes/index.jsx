/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from 'theme-ui'
import Link from 'next/link'

const notes = ({notes}) => {

  return (
    <div sx={{variant: 'containers.page'}}>
      <h1>My Notes</h1>

      <div sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
        {notes.map(note => (
          <div sx={{width: '33%', p: 2}} key={note.id}>
            <Link href="/notes/[id]" as={`/notes/${note.id}`}>
              <a sx={{textDecoration: 'none', cursor: 'pointer'}}>
                <div sx={{variant: 'containers.card'}}>
                  <strong>{note.title}</strong>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
export default notes;

export async function getServerSideProps() {
    const res = await fetch(`${process.env.APP_BASE_URL}/api/note/`)
    const {data} = await res.json()
    return {
      props: {notes: data}
    }
  }

  /**
        export async function getServerSideProps({params, req, res}) {
        const response = await fetch(`http://localhost:3000/api/note/${params.id}`)

        // so much power!
        if (!response.ok) {
            res.writeHead(302, { Location: '/notes' })
            res.end()
            return {props: {}}
        }

        const {data} = await response.json()
        
        if (data) {
            return {
            props: {note: data}
            }
        }
        }
   */