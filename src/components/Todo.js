import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Axios from 'axios';

const customStyles = {
    content : {
      top : '50%',
      left : '50%',
      right : 'auto',
      bottom : 'auto',
      marginRight : '-50%',
      transform : 'translate(-50%, -50%)'
    }
};

const TODO_ENDPOINT = "https://candidate.neversitup.com/todo"

const Todo = ({session}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalUpdateIsOpen, setUpdateIsOpen] = useState(false);
    const [modalDeleteIsOpen, setDeleteIsOpen] = useState(false);
    const [todos, setTodos] = useState({ items: [] });
    const [updateId, setUpdateId] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [deleteTitle, setDeleteTitle] = useState('');
    const [getId, setGetId] = useState('');

    const openCreateModal = () => {
        setIsOpen(true);
    }
     
    const closeCreateModal = () => {
        setIsOpen(false);
    }

    const openUpdateModal = (id) => {
        // let todoWillUpdate = todos.items.find(todo => todo._id === id);
        setUpdateId(id);
        setGetId(id)
        setUpdateIsOpen(true);
    }
     
    const closeUpdateModal = () => {
        setUpdateIsOpen(false);
    }

    const openDeleteModal = (id) => {
        setDeleteId(id);
        let todoWilltitle = todos.items.find(todo => todo._id === id);
        setDeleteTitle(todoWilltitle.title)
        setDeleteIsOpen(true);
    }

    const closeDeleteModal = () => {
        setDeleteIsOpen(false);
    }

    const handleTitle = event => {
        setTitle(event.target.value)
    }

    const handleDescription = event => {
        setDescription(event.target.value)
    }

    const clearTitleAndDesc = () => {
        setTitle('')
        setDescription('')
    }

    const fetchTodo = async () => {
        const access_token = localStorage.getItem('access_token')
        let response = await Axios.get(`${TODO_ENDPOINT}/todos`,{
            headers: {
                'Authorization': `${access_token}`
            }
        })
        setTodos({
            items: response.data
        })
    }

    const createTodo = async () => {
        const access_token = localStorage.getItem('access_token')
        await Axios.post(`${TODO_ENDPOINT}/todos`,{
            "title": title,
	        "description": description
        },{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        fetchTodo()
        closeCreateModal()
        clearTitleAndDesc()
    }

    const getTodo = async () => {
        const access_token = localStorage.getItem('access_token')
        await Axios.get(`${TODO_ENDPOINT}/todos/${getId}`,{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
    }

    const updateTodo = async () => {
        const access_token = localStorage.getItem('access_token')
        await Axios.put(`${TODO_ENDPOINT}/todos/${updateId}`,{
            "title": title,
	        "description": description
        },{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        fetchTodo()
        closeUpdateModal()
        clearTitleAndDesc()
    }

    const deteteTodo  = async () =>{
        const access_token = localStorage.getItem('access_token')
        await Axios.delete(`${TODO_ENDPOINT}/todos/${deleteId}`,{
            headers: {
                'Authorization': `${access_token}`
            }
        })
        closeDeleteModal()
        fetchTodo()
        clearTitleAndDesc()
    }

    useEffect(() => {
        fetchTodo()
      return () => {
      }
    }, [])

    return (
        <div>
            
            <div>
                {
                    todos.items.length > 0 ? todos.items.map((todo, key) => {
                        return (
                        <div>
                            <div key={todo._id} onClick={() => {
                                openUpdateModal(todo._id)
                            }}>
                                <h3 key={key}>{todo.title}</h3>
                                <p>{todo.description}</p>
                                <p>created: {todo.createdAt}</p>
                                <p>updated: {todo.updatedAt}</p>
                            </div>
                            <button type="text" onClick={() => {
                                openDeleteModal(todo._id)
                            }}>delete</button>
                        </div>
                        
                        )
                    }) : <p> Empty press 'Create' for add new todo </p>
                }
            </div>

            <div>
                <button onClick={openCreateModal}>+ Create</button>
            </div>
            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeCreateModal}
                style={customStyles}
                contentLabel="Create a new todo"
            >
                <div>
                    <div>Title</div>
                    <input type="text" placeholder="Title" value={title} onChange={handleTitle}/>
                    <div>Desscription</div>
                    <input type="text" placeholder="Desscription" value={description} onChange={handleDescription}/>
                </div>
                <div>
                    <button type="button" onClick={closeCreateModal}>Cancle</button>
                    <button type="button" onClick={createTodo}>Create</button>
                </div>
            </Modal>

            <Modal
                isOpen={modalUpdateIsOpen}
                onRequestClose={closeUpdateModal}
                style={customStyles}
                contentLabel="Create a new todo"
            >
                <div>
                    <div>Title</div>
                    <input type="text" placeholder="Title" value={title} onChange={handleTitle}/>
                    <div>Desscription</div>
                    <input type="text" placeholder="Desscription" value={description} onChange={handleDescription}/>
                </div>
                <div>
                    <button type="button" onClick={closeUpdateModal}>Cancle</button>
                    <button type="button" onClick={updateTodo}>Edit</button>
                </div>
            </Modal>

            <Modal
                isOpen={modalDeleteIsOpen}
                onRequestClose={closeUpdateModal}
                style={customStyles}
                contentLabel="Create a new todo"
            >
                <div>
                    want to delete {deleteTitle} ?
                </div>
                <div>
                    <button type="button" onClick={closeDeleteModal}>Cancle</button>
                    <button type="button" onClick={deteteTodo}>Confirm</button>
                </div>
            </Modal>
        </div>
    )
}

export default Todo