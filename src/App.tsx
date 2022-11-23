import { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import "./App.css";

function App() {
  type Course = {
    grade: "A" | "B" | "C" | "D" | "E" | "F" | string;
    no: number;
    units: number;
  };

  const successToast = (message: string) =>
    toast(`${message}`, {
      duration: 5000,
      position: "bottom-center",
      style: {
        border: "1px solid white",
        color: "white",
        backgroundColor: "#242424",
      },
    });

  const [courses, setCourses] = useState<Course[]>(
    JSON.parse(localStorage.getItem("courses")!) ?? []
  );
  const [noOfCourses, setNoOfCourses] = useState(0);

  const countRef = useRef<HTMLInputElement>(null);

  useMemo(() => {
    const arr = [];
    for (let i = 0; i < noOfCourses; i++) {
      const course: Course = { no: i + 1, grade: "F", units: 2 };
      arr.push(course);
    }
    setCourses(arr);
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [noOfCourses]);

  const handleClick = () => {
    setNoOfCourses(parseInt(countRef.current!.value));
  };

  const handleGradeInput = (grade: string, index: number) => {
    const newCourseItems = courses.map((course) =>
      course.no === index ? { ...course, grade: grade } : course
    );
    setCourses(newCourseItems);
    localStorage.setItem("courses", JSON.stringify(courses));
  };

  const handleUnitInput = (unit: number, index: number) => {
    const newCourseItems = courses.map((course) =>
      course.no === index ? { ...course, unit: unit } : course
    );
    setCourses(newCourseItems);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const toggleUnit = (index: number, value: "increment" | "decrement") => {
    if (value === "increment") {
      const updatedcourses = courses.map((course) =>
        course.no === index ? { ...course, units: course.units + 1 } : course
      );
      setCourses(updatedcourses);
    } else if (value === "decrement") {
      const updatedcourses = courses.map((course) =>
        course.no === index ? { ...course, units: course.units - 1 } : course
      );
      setCourses(updatedcourses);
    }
  };

  const handleGPCalculation = () => {
    let totalScore = 0;
    let totalObtainableGrade = 0;
    for (let i = 0; i < noOfCourses; i++) {
      switch (courses[i].grade.toUpperCase()) {
        case "A":
          totalScore += 5 * courses[i].units;
          break;
        case "B":
          totalScore += 4 * courses[i].units;
          break;
        case "C":
          totalScore += 3 * courses[i].units;
          break;

        case "D":
          totalScore += 2 * courses[i].units;
          break;
        case "E":
          totalScore += 1 * courses[i].units;
          break;
        default:
          totalScore += 0;
          break;
      }
    }

    for (let i = 0; i < noOfCourses; i++) {
      totalObtainableGrade += 5 * courses[i].units;
    }
    console.log({ totalScore, totalObtainableGrade });
    const CGPA = (totalScore / totalObtainableGrade) * 5;
    successToast(`Your CGPA is ${CGPA}.`)
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
        <p>You're offering {noOfCourses !== NaN ? noOfCourses : 0} course(s)</p>
        <form onSubmit={(e) => handleSubmit(e)} className="form">
          <input
            type="number"
            className="courses_no"
            placeholder="No Of Courses"
            min={0}
            max={20}
            ref={countRef}
          />
          <button type="submit" onClick={handleClick}>
            Go
          </button>
        </form>
        <h2>Grade, Course Units</h2>
        {courses.map((course, index) => (
          <div key={index} className="course">
            <p key={index} className="index">
              {" "}
              {index + 1}
            </p>
            <input
              type="text"
              pattern="[A-Fa-f]"
              className="grade"
              maxLength={1}
              value={course.grade}
              placeholder="Grade"
              onChange={(e) => handleGradeInput(e.target.value, index + 1)}
            />
            <input
              type="number"
              value={course.units}
              className="unit"
              placeholder="Units"
              onChange={(e) =>
                handleUnitInput(parseInt(e.target.value), index + 1)
              }
            />
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
      </div>
    </>
  );
}

export default App;
