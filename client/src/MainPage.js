import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";

// Queries
const READ_PROJECTS = gql`
  query projects{
    projects {
      id
      name
      description
    }
    times {
      id
      description
      amount
    }
  }
`;

//Mutations
const CREATE_PROJECTS = gql`
  mutation CreateProject($name: String!, $description: String!) {
    createProject(name: $name, description: $description)
  }
`;

const REMOVE_PROJECTS = gql`
  mutation RemoveProject($id: String!) {
    removeProject(id: $id)
  }
`;

const UPDATE_PROJECTS = gql`
  mutation UpdateProject($id: String!, $name: String!, $description: String!) {
    updateProject(id: $id, name: $name, description: $description)
  }
`;

const MainPage = () => {

  const { data, loading, error } = useQuery(READ_PROJECTS, {
    pollInterval: 500
  });
  const [createProject] = useMutation(CREATE_PROJECTS);
  const [deleteProject] = useMutation(REMOVE_PROJECTS);
  const [updateProject] = useMutation(UPDATE_PROJECTS);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // function which is called after a project is submitted and creates it
  const handleSubmit = (e) => {
    e.preventDefault();
    createProject({ variables: { name: name, description: description } })
  }

  // checks for loading, errors or missing data
  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;


  return (
    <div className="create">
      <h1>Main Page</h1>

      {/* form which is used to sumbit a project with name and description as variables */}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input id="name" type="text" required value={name}
          onChange={(e) => setName(e.target.value)}></input>

        <label>Description:</label>
        <textarea id="description" required value={description}
          onChange={(e) => setDescription(e.target.value)} >
        </textarea>

        <button>Add Project</button>
      </form>

      {/* listing the created projects */}
      {data.projects.map((project) =>
        <li key={project.id} >
          <h5>{project.name}</h5>
          <p>{project.description}</p>

          {/* View button to open the project page */}
          <Link to={{ pathname: `/project/${project.id}`, state: { project } }}>
            <button>View</button></Link>

          {/* Update button which updates the project's name and description with the new values entered in the form */}
          <button className="update" onClick={() => {
            /* Variables used to get the new values from the form */ 
            let updatedName = document.getElementById("name").value;
            let updatedDescription = document.getElementById("description").value;
            updateProject({ variables: { id: project.id, name: updatedName, description: updatedDescription } });
          }}>Update</button>

          {/* Delete button which deletes the project from the list */}
          <button className="delete" onClick={() => {
            deleteProject({ variables: { id: project.id } });
          }}>Delete</button>

        </li>
      )}
    </div>
  );
}

export default MainPage;