import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

const App = (props) => {
    const [count, setCount] = useState(props.count)
    const [text, setText] = useState('')

    useEffect(() => {
        console.log('This should only run once')
    }, [])  // depends on nothing

    useEffect(() => {
        console.log('useEffect ran')
        document.title = count
    }, [count])


    return (
        <div>
            <p>The current {text || 'count'} is {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>reset</button>
            <input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    )
}

App.defaultProps = {
    count: 0
}

const notesReducer = (state, action) => {
    switch (action.type) {
        case 'POPULATE_NOTES':
            return action.notes
        case 'ADD_NOTE':
            return [...state, { title: action.title, body: action.body }]
        case 'REMOVE_NOTE':
            return state.filter((note) => note.title !== action.title)
        default:
            return state
    }
}

const NoteApp = () => {
    const [notes, dispatch] = useReducer(notesReducer, [])
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    useEffect(() => {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]')
        if (notes) {
            dispatch({ type: 'POPULATE_NOTES', notes })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes])

    const addNote = (e) => {
        e.preventDefault()
        dispatch({ type: 'ADD_NOTE', title, body })
        setTitle('')
        setBody('')
    }

    const removeNote = (title) => {
        dispatch({ type: 'REMOVE_NOTE', title })
    }

    return (
        <div>
            <h1>Notes</h1>
            {notes.map((note) => (
                <Note key={note.title} note={note} removeNote={removeNote} />
            ))}
            <p>Add Note</p>
            <form onSubmit={addNote}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={body} onChange={(e) => setBody(e.target.value)} />
                <button>add note</button>
            </form>
        </div>
    )
}

const Note = ({ note, removeNote }) => {
    useEffect(() => {
        console.log('Setting up effect!')

        return () => {  // componentDidUnmount
            console.log('Cleaning up effect!')
        }
    }, [])

    return (
        <div>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <button onClick={() => removeNote(note.title)}>x</button>
        </div>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <App></App>
        <NoteApp></NoteApp>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
