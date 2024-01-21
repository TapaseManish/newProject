import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
const Table = () => {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataLength, setDataLength] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [keywords, setKeywords] = useState("");
  const [month, setMonth] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isOpenChart, setIsOpenChart] = useState(false);
  const [selectedValueChart, setSelectedValueChart] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const productPerPage = 10;
  const lastIndex = currPage * productPerPage;
  const firstIndex = lastIndex - productPerPage;
  const records = products.slice(firstIndex, lastIndex);
  const noPages = Math.ceil(dataLength / productPerPage);
  const montArr = [
    "jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "july",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  //const numbers = [...Array(noPages + 1)].slice(1);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await axios.get(
        "http://localhost:5000/api/v1/product/products-transactions"
      );
      if (result.data.success === true) {
        console.log(result.data.productLength);
        setProducts(result.data.listOfData);
        setDataLength(result.data.productLength);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/product/search-products/${keywords}`
      );
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFilterByMonth = async (month, flag) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/product/month-filter/${month}`
      );
      if (flag === "table") {
        setProducts(data);
      } else if (flag === "chart") {
        setChartData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const handleToggle2 = () => {
    setIsOpenChart(!isOpenChart);
  };

  const handleOptionClick = (value,flag) => {
    if(flag==="table"){
      setSelectedValue(value);
    setIsOpen(false);
    }else if(flag==="chart"){
    setSelectedValueChart(value);
    setIsOpenChart(false);
    }
  };

  useLayoutEffect(() => {
    let charArr = [0,0,0,0,0,0,0,0,0,0];
    chartData.map((it,ind)=>{
        if ( 0 < it.price && it.price < 100 ) charArr[0] = charArr[0]+1; 
        if ( 100 < it.price && it.price < 200 ) charArr[1] = charArr[1]+1; 
        if ( 200< it.price && it.price < 300 ) charArr[2] = charArr[2]+1; 
        if ( 300 < it.price && it.price < 400 ) charArr[3] = charArr[3]+1; 
        if ( 400 < it.price && it.price < 500 ) charArr[4] = charArr[4]+1; 
        if ( 500 < it.price && it.price < 600 ) charArr[5] = charArr[5]+1; 
        if ( 600 < it.price && it.price < 700 ) charArr[6] = charArr[6]+1; 
        if ( 700< it.price && it.price < 800 ) charArr[7] = charArr[7]+1; 
        if ( 800 < it.price && it.price < 900 ) charArr[8] = charArr[8]+1; 
        if ( 900 < it.price) charArr[9] = charArr[9]+1; 
    })
    console.log(charArr[5]);
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: [
          "0-100",
          "101-200",
          "201-300",
          "301-400",
          "401-500",
          "501-600",
          "601-700",
          "701-800",
          "801-900",
          "901-above",
        ],
        datasets: [
          {
            label: "No of items",
            data: charArr,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <>
      <section style={{ display: "flex", flexWrap: "wrap"}}>
        <div>
          <div style={{ position: "absolute",zIndex:"2", left: "23vw", top: "5vh" }}>
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              reload
            </button>
          </div>
          <form
            className="d-flex"
            role="search"
            onSubmit={handleSearch}
            style={{ position: "absolute", zIndex:"2",left: "30vw", top: "5vh" }}
          >
            <input
              type="search"
              placeholder="search here"
              aria-label="Search"
              style={{ width: "10em", height: "3em" }}
              value={keywords}
              onChange={(e)=>
                setKeywords(e.target.value ? e.target.value : "")
              }
            />
            <button
              style={{ height: "3em", width: "5em", color: "black" }}
              className="btn btn-outline-success"
              type="submit"
            >
              Search
            </button>
          </form>
          <div
            style={{
              position: "absolute",
              left: "65vw",
              top: "4vh",
              padding: "5px",
              zIndex: "2",
              backgroundColor: "white",
            }}
          >
            <button onClick={handleToggle}>
              {selectedValue ? selectedValue : "Select an month"}
            </button>
            {isOpen && (
              <ul style={{ listStyleType: "none" }}>
                {montArr.map((option, i) => (
                  <li
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleFilterByMonth(option, "table");
                      handleOptionClick(option,"table");
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position:"relative",
              left:"15vw"
            }}
          >
            <table
              style={{
                border: "2px solid black",
                position: "relative",
                top: "12vh",
                padding: "2em",
              }}
            >
              <thead>
                <tr style={{ alignContent: "space-between" }}>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Sold</th>
                  <th>image</th>
                  <th>Date Of Sale</th>
                </tr>
              </thead>
              <tbody>
                {records.map((it, i) => {
                  return (
                    <>
                      <tr
                        key={i + 1}
                        style={{
                          border: "2px solid black",
                          height: "2em",
                          width: "10em",
                          alignItems: "center",
                          alignContent: "space-around",
                        }}
                      >
                        <td>{i + 1}</td>
                        <td>{it.title.substr(1, 20)}...</td>
                        <td>{it.description.substr(1, 30)}...</td>
                        <td>{it.price}</td>
                        {it.sold ? (
                          <>
                            <td>Yes</td>
                          </>
                        ) : (
                          <>No</>
                        )}
                        <td>
                          <img
                            src={it.image}
                            style={{
                              height: "2em",
                              width: "2em",
                            }}
                            alt={it.title.substr(1, 10)}
                          />
                        </td>
                        <td>{it.dateOfSale}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <nav style={{ position: "relative", left: "40vw", top: "12vh" }}>
            <ul
              style={{
                display: "flex",
                flexFlow: "row",
                listStyleType: "none",
              }}
            >
              <li>
                <a
                  href="#"
                  style={{
                    textDecoration: "none",
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "black",
                    border: "2px solid white",
                    padding: "5px",
                  }}
                  onClick={() => {
                    if (currPage !== firstIndex && currPage > 1) {
                      setCurrPage(currPage - 1);
                    } else {
                      alert("You are at the beginning of the list!");
                    }
                  }}
                >
                  Prev
                </a>
              </li>
              &nbsp;
              <li className="prevPage">
                <a
                  href="#"
                  style={{
                    textDecoration: "none",
                    fontSize: "15px",
                    color: "white",
                    backgroundColor: "black",
                    border: "2px solid white",
                    padding: "5px",
                  }}
                  onClick={() => {
                    if (currPage !== lastIndex && currPage < noPages) {
                      setCurrPage(currPage + 1);
                    } else {
                      alert("You are on the last page!");
                    }
                  }}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div
          style={{
            height: "50vh",
            width: "70vw",
            position: "relative",
            top: "20vh",
            left: "20vw",
          }}
        >
          <canvas ref={chartRef} />
        </div>
        <div
            style={{
              position: "relative",
              right: "10vw",
              top: "5vh",
            }}
          >
            <button onClick={handleToggle2}>
              {selectedValueChart ? selectedValueChart : "Select an month"}
            </button>
            {isOpenChart && (
              <ul style={{ listStyleType: "none" ,background:"white"}}>
                {montArr.map((option, i) => (
                  <li
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleFilterByMonth(option, "chart");
                      handleOptionClick(option,"chart");
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
      </section>
    </>
  );
};

export default Table;
