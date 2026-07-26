// import { useState } from "react";
// import api from "../services/api";

// export default function Form() {
//   const [formData, setFormData] = useState({
//     destination: "",
//     days: "",
//     budget: "",
//     interests: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [itinerary, setItinerary] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const response = await api.post("/travel/plan", {
//         destination: formData.destination,
//         days: Number(formData.days),
//         budget: Number(formData.budget),
//         interests: formData.interests
//           .split(",")
//           .map((item) => item.trim()),
//       });

//       setItinerary(response.data.itinerary);
//     } catch (error) {
//       alert("Something went wrong.");
//       console.error(error);
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ maxWidth: "700px", margin: "40px auto" }}>
//       <form onSubmit={handleSubmit}>
//         <h1>🌍 AI Travel Planner</h1>

//         <br />

//         <input
//           type="text"
//           name="destination"
//           placeholder="Destination"
//           value={formData.destination}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         <input
//           type="number"
//           name="days"
//           placeholder="Days"
//           value={formData.days}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         <input
//           type="number"
//           name="budget"
//           placeholder="Budget"
//           value={formData.budget}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         <input
//           type="text"
//           name="interests"
//           placeholder="Beach, Adventure, Nature"
//           value={formData.interests}
//           onChange={handleChange}
//         />

//         <br />
//         <br />

//         <button type="submit">
//           {loading ? "Generating..." : "Generate Plan"}
//         </button>
//       </form>

//       <br />

//       <pre
//         style={{
//           whiteSpace: "pre-wrap",
//           background: "#fff",
//           padding: "20px",
//           borderRadius: "10px",
//         }}
//       >
//         {itinerary}
//       </pre>
//     </div>
//   );
// }