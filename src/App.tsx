import { useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

type Course = {
  grade: string;
  no: number;
  unit: number;
};

/*CGPA Toast. Displays the final CGPA
 after user input is complete. */
const cgpaToast = (message: string) =>
  toast(`${message}`, {
    duration: 6000,
    position: "top-center",
    style: {
      border: "1px solid white",
      marginTop: "30px",
      color: "white",
      backgroundColor: "#242424",
    },
  });

function App() {
  /*initialized empty course and noOfCourses states */
  const [courses, setCourses] = useState<Course[]>([]);
  const [noOfCourses, setNoOfCourses] = useState(0);

  const countRef = useRef<HTMLInputElement>(null);

  useMemo(() => {
    /*when the user inputs their total number of courses, an array is created
    that contains the same number of courses as the user input. The default value of
    course no is (array index + 1), grade is F (this is used as default as the users can have
      courses they have not received results for) and a course unit of 2 */

    let arr = [];
    for (let i = 0; i < noOfCourses; i++) {
      const course: Course = { no: i + 1, grade: "F", unit: 2 };
      arr.push(course);
    }
    setCourses(arr);
    console.log({ arr, noOfCourses, courses });
  }, [noOfCourses]);

  const handleCourseInput = () => {
    /*on course input, set the noOfCourses state to the
    value of what the user puts in */
    setNoOfCourses(parseInt(countRef.current!.value));
  };

  const handleGradeInput = (grade: string, index: number) => {
    /*on grade change, loop through each course in the courses list and upgrade
    the course's grade accordingly */
    const newCourseItems = courses.map((course) =>
      course.no === index ? { ...course, grade: grade } : course
    );
    setCourses(newCourseItems);
  };

  const toggleUnit = (index: number, value: "increment" | "decrement") => {
    if (value === "increment") {
      /*on course unit increment, loop through each course in the courses list and increase
    the course's unit by 1 */
      const updatedcourses = courses.map((course) =>
        course.no === index ? { ...course, unit: course.unit + 1 } : course
      );
      setCourses(updatedcourses);
    } else if (value === "decrement") {
      /*on course unit decrement, loop through each course in the courses list and decrease
    the course's unit by 1 */
      const updatedcourses = courses.map((course) =>
        course.no === index && course.unit! > 1
          ? { ...course, unit: course.unit - 1 }
          : course
      );
      setCourses(updatedcourses);
    }
  };

  const handleGPCalculation = () => {
    let totalScore = 0;
    let totalGradePoints = 0;

    /*calculate the total score of the user based on the 
    number of courses and the units each courses carry.*/

    for (let i = 0; i < noOfCourses; i++) {
      switch (courses[i].grade.toUpperCase()) {
        case "A":
          totalScore += 5 * courses[i].unit;
          break;
        case "B":
          totalScore += 4 * courses[i].unit;
          break;
        case "C":
          totalScore += 3 * courses[i].unit;
          break;

        case "D":
          totalScore += 2 * courses[i].unit;
          break;
        case "E":
          totalScore += 1 * courses[i].unit;
          break;
        default:
          totalScore += 0 * courses[i].unit;
          break;
      }
    }

    /*calculate the total obtainable grade of the user based on the 
    number of courses and the units each courses carry.*/

    for (let i = 0; i < noOfCourses; i++) {
      totalGradePoints += courses[i].unit;
    }

    /*The CGPA is then generated from the total score divided
    by the total obtainable grade multiplied by the highest GP. In our case it's 5*/
    const CGPA = totalScore / totalGradePoints;
    /*0 divided by a number is Infinity. return 0 if the CGPA is not finite. */
    if (Number.isFinite(CGPA)) {
      cgpaToast(`Your CGPA is ${CGPA.toFixed(2)}.`);
    } else {
      cgpaToast(`Your CGPA is 0.00.`);
    }
  };
  return (
    <>
      <Toaster />
      <div className="app">
        <h1>CGPA Calculator.</h1>
        <p className="info">
          Enter the total number of courses you are offering here. Do not bother
          about courses with unreleased results as they will have a default
          score of 0.
        </p>
        <p>
          You are offering (
          {Number.isNaN(noOfCourses) || noOfCourses === 0 ? 0 : noOfCourses})
          courses.
        </p>
        <div className="form">
          <input
            type="number"
            className="courses_no"
            placeholder="No Of Courses"
            min={0}
            max={20}
            ref={countRef}
          />
          <button type="submit" onClick={handleCourseInput}>
            Go
          </button>
        </div>
        <h2>Grade -- Course Unit</h2>
        {courses.map((course, index) => (
          <div key={index} className="course">
            <p key={index} className="index">
              {" "}
              {index + 1}
            </p>
            <select
              name=""
              id=""
              value={course.grade}
              className="grade"
              onChange={(e) => handleGradeInput(e.target.value, index + 1)}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
            </select>

            <div className="unit" placeholder="Unit">
              {course.unit}
            </div>
            <div className="counter">
              <button
                onClick={() => toggleUnit(index + 1, "increment")}
                className="inc"
              >
                +
              </button>
              <button onClick={() => toggleUnit(index + 1, "decrement")}>
                -
              </button>
            </div>
          </div>
        ))}
        {courses.length > 0 && (
          <button className="gp" onClick={handleGPCalculation}>
            Calculate GP
          </button>
        )}
        <div className="links">
          <a href="https://github.com/temiloluwa-js" className="git">
            <img src="/github.svg" alt="Github Link" width={30} height={30} />
          </a>
          <a href="https://twitter.com/_rxrz">
            <img src="/twitter.svg" alt="Twitter Link" width={30} height={30} />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
