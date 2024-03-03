import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { useAuth } from "../../utils/auth";

function Home() {
  const [snowfallData, setSnowfallData] = useState([]);
  const [days, setDays] = useState(3);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnowfallData = async () => {
      try {
        const token = await auth.getSession();
        const accessToken = token.access.token;

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/snowfall/${days}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const sortedData = response.data.snowfallData.sort((a, b) => {
          return a.skiResort.localeCompare(b.skiResort);
        });

        setSnowfallData(sortedData);
      } catch (error) {
        console.error("Failed to fetch snowfall data", error);
        if (error.response && error.response.status === 401) {
          auth.logout();
          navigate("/login");
        }
      }
    };

    fetchSnowfallData();
  }, [auth, navigate, days]);

  const maxSnowfall = Math.max(...snowfallData.map(data => data.totalSnowfall), 0);

  return (
    <div className={styles["snowfall-container"]}>
      <h1>Snowfall Data</h1>
      <div className={styles["controls"]}>
        <select
          value={days}
          onChange={e => setDays(e.target.value)}
          className={styles["day-selector"]}
        >
          <option value="1">Today</option>
          <option value="2">Last 2 Days</option>
          <option value="3">Last 3 Days</option>
        </select>
        <button
          className={styles.logout}
          onClick={() => {
            auth.logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
      {snowfallData.length > 0 ? (
        <ul>
          {snowfallData.map(({ skiResort, totalSnowfall }) => (
            <li key={skiResort} className={styles["list-item"]}>
              <div className={styles["snowfall-info"]}>
                {skiResort}: <span className={styles["snowfall-data"]}>{totalSnowfall} mm</span>
              </div>
              <div className={styles["progress-bar-container"]}>
                <div
                  className={styles["progress-bar"]}
                  style={{ width: `${(totalSnowfall / maxSnowfall) * 100}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No snowfall data available.</p>
      )}
    </div>
  );
}

export default Home;
