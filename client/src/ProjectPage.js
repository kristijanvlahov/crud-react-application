import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from "graphql-tag";

// Queries
const READ_PROJECTS = gql`
  query projects{
    projects {
      id
      name
      description
      times {
        id
        description
        amount
      }
    }
    
  }
`;

// Mutations
const CREATE_TIMES = gql`
  mutation CreateTime($id: String!,$description: String!, $amount: Int!) {
    createTime(id: $id,description: $description, amount: $amount)
  }
`;

const REMOVE_TIMES = gql`
  mutation RemoveTime($id: String!, $projectid: String!) {
    removeTime(id: $id, projectid: $projectid)
  }
`;

const ProjectPage = () => {
  const { data, loading, error } = useQuery(READ_PROJECTS, {
    pollInterval: 500
  });
  const [createTime] = useMutation(CREATE_TIMES);
  const [deleteTime] = useMutation(REMOVE_TIMES);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const location = useLocation();

  // function which calculates the total amount of hours for all the listed times
  const calculateAmount = (data) => {
    let totalAmount = data.projects.find(x => x.id === location.state.project.id).times.reduce((total, time) => total + time.amount, 0);
    return totalAmount;
  }

  // function which is called after a time is submitted and creates it
  const handleSubmit = (e) => {
    e.preventDefault();
    createTime({ variables: { description: description, amount: amount, id:location.state.project.id } })
  }

  // checks for loading, errors or missing data
  if (loading) return <p>loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <div className="project-page">

      <Link to="/"> Back</Link>

      {/* showing the name, description and total added hours for a project */}
      <div className="project-info">
        <h4>Project name: {location.state.project.name}</h4>
        <p>Description: {location.state.project.description}</p>
        <h6>Total added hours: {calculateAmount(data)}</h6>
      </div>

      {/* listing the created times */}
      <div className="list-times">
        {data.projects.find(x => x.id === location.state.project.id).times.map((time) =>
          <li key={time.id} >
            <h5>{time.description}</h5>
            <p>{time.amount}</p>

            {/* Delete button which deletes the time from the list */}
            <button className="delete" onClick={() => {
              deleteTime({ variables: { id: time.id, projectid: location.state.project.id } });
            }}>Delete</button>
          </li>
        )}
      </div>

      {/* form which is used to submit time with description and amount as variables */}
      <div className="form">
        <form onSubmit={handleSubmit}>

          <label>Description:</label>
          <textarea required value={description}
            onChange={(e) => setDescription(e.target.value)} >
          </textarea>

          <label>Amount of hours:</label>
          <input type="number" required value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}></input>

          <button>Add Time</button>
        </form>
      </div>
    </div>
  );
}

export default ProjectPage;

