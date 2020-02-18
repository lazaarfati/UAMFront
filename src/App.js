import React from "react";
import { render } from "react-dom";
import axios from 'axios';    

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

class App extends React.Component {
   intervalID;
  constructor() {
    super();
    this.state = {
      data: [],
      pages:0,
      loading: false,
      size:5

    };
      
  }
 

   refresh(time){
     this.setState({pages:"0"});
     this.setState({size:"5"})
     setTimeout(this.getTestData(this.state.pages, this.state.size, (res) => {
       this.setState({
                  data: res.data.content,
                  pages: res.data.totalElements,
                  loading: false
      });}), time)

   }
   getTestData(page, pageSize, handleRetrievedData) {
        let url = 'http://localhost:8080/api/taskExecutionList?page='+page+'&size='+pageSize+'';

        return axios.get(url).then(response => handleRetrievedData(response)).catch(response => console.log(response));
    }
     handleSetData = data => {
    console.log(data);
    this.setState({ data: data });
  };
    textFilter(filter, row){
    let result =parseInt( row[filter.id].toUpperCase().indexOf(filter.value.toUpperCase()), 10);
    if(result < 0){
      return false;
    }else{
      return true;
    }
  }

  render() {
    const { data } = this.state;
    const container ={
      padding :'5em',
    }
    const select ={
    width: '15%',
    marginBottom: '30px',
    marginLeft :'10px'
    }
    const title ={
    textAlign: 'center',
    marginBottom: '40px',
    }
    return (
      <div style={container}>
       <h1 style={title}>Test technique UAM Oujda</h1>

      <label>Refresh data :  </label>
      <select style={select} onChange={(e) => this.refresh(e.target.value)}>
      <option value="5000">5</option>
      <option value="10000">10</option>
      <option  value="15000">15</option>
      <option selected value="20000">20</option>
      </select>
        <ReactTable
          data={data}
          pages={this.state.pages}
          columns={[
          {
              Header: "id",
              accessor: "id",
              filterMethod: (filter,row) => {return this.textFilter(filter,row)}
            },
            {
              Header: "CreationDate",
              accessor: "creationDate"
            },
            {
              Header: "TaskConfigName",
              accessor: "taskConfigName"
            },
            {
              Header: "DurationInSeconds",
              accessor: "durationInSeconds"
            }, {
              Header: "Status",
              accessor: "status"
            },
              {
              Header: "TransportedFiles",
              accessor: "transportedFiles"
            }
            
          ]}
          filterable
          loading={this.state.loading}
          pageSizeOptions={[2,4,6,8,10]}
          defaultPageSize={6}
          className="-striped -highlight"
          onFetchData={(state, instance) => {
                  this.setState({loading: true});
                  this.getTestData(state.page, state.pageSize, (res) => {
                  this.setState({
                          data: res.data.content,
                          pages: res.data.totalElements,
                          loading: false
                  });
                  setTimeout(this.getTestData(state.page, state.pageSize, (res) => {
                    this.setState({
                          data: res.data.content,
                          pages: res.data.totalElements,
                          loading: false
                  });
                  }), 5000)
          });
          }
          }
        />
        <br />
      </div>
    );
  }
}
export default App;
render(<App />, document.getElementById("root"));
