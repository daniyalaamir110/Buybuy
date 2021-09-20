import {useState, useEffect} from "react";
import Sidebar from "../Sidebar";
import axios from "axios";

const BuyerDashboard = () => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/get-logs")
      .then(res => setLogs(res.data.logs));
  }, [])

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 my-2 text-center">Dashboard</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container-fluid">
        <div className="row p-3 m-3">
          <div className="col-12">
            <h2>Your Activity and Notifications</h2>
            {logs.map(log => (
              <div class="alert alert-info" role="alert">
                <div dangerouslySetInnerHTML={{__html: log.message}} />
                <div>{(new Date(log.created_at)).toDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerDashboard;
