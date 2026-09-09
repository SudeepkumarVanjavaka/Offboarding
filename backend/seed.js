import Employee from "./models/employee.js";
import Workflow from "./models/workflow.js";

export const seedInitialData = async () => {
    try {
        const employeeCount = await Employee.countDocuments();
        if (employeeCount === 0) {
            await Employee.insertMany([
                {
                    employeeId: "EMP001",
                    name: "Sudeep Rao",
                    email: "sudeep.rao@blazeup.com",
                    department: "Engineering",
                    designation: "Senior Software Engineer",
                    joiningDate: new Date("2022-03-15")
                },
                {
                    employeeId: "EMP002",
                    name: "Priya Sharma",
                    email: "priya.sharma@blazeup.com",
                    department: "Design",
                    designation: "Lead UI/UX Designer",
                    joiningDate: new Date("2021-08-01")
                },
                {
                    employeeId: "EMP003",
                    name: "Rahul Verma",
                    email: "rahul.verma@blazeup.com",
                    department: "Marketing",
                    designation: "Growth Marketing Lead",
                    joiningDate: new Date("2023-01-10")
                },
                {
                    employeeId: "EMP004",
                    name: "Anita Desai",
                    email: "anita.desai@blazeup.com",
                    department: "Finance",
                    designation: "Financial Analyst",
                    joiningDate: new Date("2022-11-20")
                }
            ]);
            console.log("Seeded initial employee records.");
        }

        const workflowCount = await Workflow.countDocuments();
        if (workflowCount === 0) {
            await Workflow.create({
                name: "Standard Offboarding Workflow",
                stages: [
                    { name: "Project / Reporting Manager", role: "Manager", order: 1, type: "Sequential" },
                    { name: "Admin & Systems", role: "System Admin", order: 2, type: "Sequential" },
                    { name: "Accounts", role: "Finance Officer", order: 3, type: "Sequential" },
                    { name: "Personnel", role: "HR Personnel", order: 4, type: "Sequential" },
                    { name: "HR", role: "HR Head", order: 5, type: "Sequential" }
                ]
            });
            console.log("Seeded default offboarding workflow.");
        }
    } catch (error) {
        console.error("Error during initial data seeding:", error.message);
    }
};
