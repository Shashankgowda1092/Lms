import React, { useEffect } from "react";

import {
  LandingPage,
  About,
  Login,
  Register,
  MyProfile,
  Help,
  Missing,
  UnAuthorized,
  UnderMaintainance,
  TraineeDashBoard,
  TrainerDashBoard,
  BatchList,
  RoleSelect,
  Resources,
} from "./indexRoute";
import RequireAuth from "../Components/RequireAuth";
import { Routes, Route, useNavigate } from "react-router-dom";

import AdminDash from "../Pages/AdminDash";
import Layout from "../Layouts/Layout";
import DashBoardLayout from "../Layouts/DashBoardLayout";
import PagesLayout from "../Layouts/PagesLayout";
import ForgotPassword from "../Pages/ForgotPassword";
import EnterNewPassword from "../Pages/EnterNewPassword";
import AuthService from "../Api/services/AuthService";
import UserListPage from "../Components/AdminDashBoard/Userslist";
import useAuth from "../Hooks/useAuth";
import CreateBatch from "../Pages/CreateBatch"; // Import your CreateBatch component
import ViewBatches from "../Pages/ViewBatches";
import BatchDetails from "../Pages/BatchDetails";
import UsersList from "../Pages/UsersList";
import LearningPlan from "../Pages/LearningPlan";
import LearningResource from "../Pages/LearningResource";
import ProgressList from "../Pages/ProgressList";
import EditBatch from "../Pages/EditBatch";
import BulkUpload from "../Components/LearnPlan/BulkUpload";
import { ExistingPlan } from "../Components/LearnPlan/ExistingPlan";
import { Course } from "../Components/LearnPlan/Course";
import { Topics } from "../Components/LearnPlan/topics";
import { NewPlan } from "../Components/LearnPlan/NewPlan";
import NavbarDefault from "../Components/LearningResource/Navbar";
import ChangePassword from "../Pages/ChangePassword";
import BatchSelectPage from "../Pages/BatchSelectPage";
import AttendancePage from "../Pages/AttendancePage";
import UpdateAttendance from "../Pages/UpdateAttendance";
import { AttendanceDashboard } from "../Pages/AttendanceDashboard";
import ViewBatchesUser from "../Pages/ViewBatchesUser";
import {ButtonVariants} from "../Components/EvaluationScores/Navbar"
// import BatchComponent from "../Components/EvaluationScores/BatchComponent";
// import TrainerCourseList from "../Pages/TrainerCourseList";
import ViewBatchesTrainer from "../Pages/ViewBatchesTrainer";
import Evaluations_dash from "../Components/Evaluation_folder/Evaluations";
import TableWithStripedRows from "../Pages/Att"
function AppRoutes() {
  const auth = useAuth();
  return (
    <div className=" w-full h-sccreen" style={{ userSelect: "none" }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes*/}
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/help" element={<Help />}></Route>
          <Route path="/roleSelect" element={<RoleSelect />}></Route>
          <Route path="/enter-new-password" element={<EnterNewPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>





        {/* TRAINEE:  trainee acces paths */}
        <Route element={<RequireAuth allowedRoles={["USER"]} />}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route
              path="/dashboard/trainee"
              element={<TraineeDashBoard />}
            ></Route>
          </Route>
          <Route path="/" element={<PagesLayout />}>
            {/* Trainee pages here */}
            <Route path="/resources" element={<Resources />}></Route>
            <Route path="/lms/batch" element={<ViewBatchesUser />} />
            <Route path="/evaluation" element={<ButtonVariants/>}></Route>

            <Route
              path="lms/batch/learningPlan"
              element={<LearningPlan />}
            />
            <Route
              path="/lms/batch/learningPlan/resources"
              element={<LearningResource />}
            />
            <Route
              path="/lms/batch/learningPlan/resources"
              element={<LearningResource />}
            />
          </Route>
        </Route>






        {/* admin :  admin access path*/}
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route path="/dashboard/admin" element={<AdminDash />}></Route>
          </Route>
          <Route path="/" element={<PagesLayout />}>
            {/* Admin pages here */}
            <Route path="/resources" element={<Resources />} />
            <Route path="/lms/userlist" element={<UserListPage />} />{" "}
            {/* Route to UserListPage */}
            <Route path="/batch-list" element={<BatchList />}></Route>
            <Route path="/bulkcourse" element={<BulkUpload />} />
            <Route path="/newplan" element={<NewPlan />} />
            <Route path="/course" element={<Course />} />
            <Route path="/existingplan" element={<ExistingPlan />} />
            <Route path="/topics" element={<Topics />} />
          </Route>
        </Route>

        {/* trainer :  trainer access path*/}
        <Route element={<RequireAuth allowedRoles={["TRAINER"]} />}>
          <Route path="/dashboard" element={<DashBoardLayout />}>
            <Route
              path="/dashboard/trainer"
              element={<TrainerDashBoard />}
            ></Route>
          </Route>
          <Route path="/" element={<PagesLayout />}>
            {/* Trainer pages here */}
            <Route path="/courses" element={<ViewBatchesTrainer />} />
            <Route path="/courses/learningPlan" element={<LearningPlan />} />
            <Route path="/courses/LearningPlan/LeaningResource" element={<LearningResource />} />
            <Route path="/courses/LearningPlan/batchUsersProgress" element={<ProgressList />} />
            <Route path="/learningresource" element={<NavbarDefault />} />
            <Route path="/evaluations" element={<Evaluations_dash />} />

          </Route>
        </Route>



        <Route element={<RequireAuth allowedRoles={["ADMIN", "TRAINER"]} />}>
          <Route path="/" element={<PagesLayout />}>
            <Route path="/lms/batches" element={<ViewBatches />} />
            <Route path="/lms/batches/create-batch" element={<CreateBatch />} />
            <Route path="/lms/batches/editBatch" element={<EditBatch />} />
            <Route
              path="/lms/batches/batchDetails"
              element={<BatchDetails />}
            />
            <Route
              path="/lms/batches/batchDetails/addUsersToBatch"
              element={<UsersList />}
            />
            <Route
              path="/lms/batches/batchDetails/batchUsersProgress"
              element={<ProgressList />}
            />

          </Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
          <Route path="/" element={<PagesLayout />}>
            <Route path="/attendance/BatchSelect" element={<BatchSelectPage />} />
            <Route
              path="/attendance/takeAttendance"
              element={<AttendancePage />}
            />
            <Route
              path="/attendance/updateAttendance"
              element={<UpdateAttendance />}
            />
            <Route path="/attendance" element={<TableWithStripedRows />} />
          </Route>
        </Route>

        <Route
          element={<RequireAuth allowedRoles={["ADMIN", "TRAINER", "USER"]} />}
        >
          <Route path="/" element={<PagesLayout />}>
            <Route
              path="/lms/batches/batchDetails/learningPlan"
              element={<LearningPlan />}
            />
            <Route
              path="/lms/batches/batchDetails/attachLearningPlan"
              element={<ExistingPlan />}
            />
            <Route
              path="/lms/batches/batchDetails/learningPlan/resources"
              element={<LearningResource />}
            />

          </Route>
        </Route>

        {/* missing*/}
        <Route path="*" element={<Missing />}></Route>

        <Route path="/unauthorized" element={<UnAuthorized />}></Route>
        <Route
          path="/underMaintainance"
          element={<UnderMaintainance />}
        ></Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
