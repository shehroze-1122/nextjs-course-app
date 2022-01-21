/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from 'theme-ui'

const allNotes = ({note}) => {

  return (
    <div sx={{variant: 'containers.page'}}>
      <h1>Note: {note.title} </h1>
    </div>
  )
}
export default allNotes;

// can be accomplished using simply getServerSideProps or otherwise you cannot use only getStaticProps
// since the url is dynamic having different values for differt params [id] and it will not be catered run time but at build time so no access to params

export async function getStaticPaths(){
  const resp = await fetch('http://localhost:3000/api/note')
  const { data } = await resp.json()

  const paths = data.map((note)=>({ params: { id: String(note.id)} }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }){

  const response = await fetch(`http://localhost:3000/api/note/${params.id}`);
  const { data } = await response.json()

  return {
    props: {
      note: data
    }
  }
}