import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Yell from "../Assets/Yell.svg"
// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Input,
  Button,
  CardHeader,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";

const TABS = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Active",
    value: "Active",
  },
  {
    label: "In-Active",
    value: "Non-Active",
  },
];

const BatchHeader = ({
  toggleHandler,
  card,
  onStatusChange,
  searchHandler,
  changeCardLayout,
}) => {
  const [status, setStatus] = useState("All");

  useEffect(() => {
    setStatus("All");
  }, []); // Run once when component mounts

  const handlerTabClick = (value) => {
    setStatus(value);
    onStatusChange(value);
  };

  return (
    <CardHeader floated={false} shadow={false} className="rounded-none" style={{
      background:'linear-gradient(135deg, white, 0%, white 50%, #F9D866 100%)',
      borderRadius:'15px',
      padding:'15px'
      
      }}>
      <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 ml-4 sm:ml-12">
        <div>
          <Typography variant="h5" color="blue-gray">
            Batch list
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            See information about all Batches
          </Typography>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          {card && (
            <Tooltip content="Change Card Layout">
              <span
                onClick={() => {
                  changeCardLayout();
                }}
              >
                <IconButton variant="text">
                  <img
                    width="50"
                    height="50"
                    src="https://img.icons8.com/ios/50/rows.png"
                    alt="rows"
                  />
                </IconButton>
              </span>
            </Tooltip>
          )}
          <Button
            variant="outlined"
            onClick={toggleHandler}
            className="w-full sm:w-auto"
          >
            {card ? "Table View" : "Card View"}
          </Button>
          <Link to="/lms/batches/create-batch">
            <Button className="flex items-center gap-2 mr-5" style={{background:'#023047'}}>
              <UserPlusIcon strokeWidth={2} className="h-5 w-5" /> Create New
              Batch
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ml-4 sm:ml-12">
        <Tabs value={status} className="w-full sm:w-72 md:w-96">
          <TabsHeader>
            {TABS.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => handlerTabClick(value)}
              >
                &nbsp;&nbsp;{label}&nbsp;&nbsp;
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
        <div className="w-full sm:w-72 md:w-96 mr-5">
          <label
            htmlFor="search-input"
            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal ..."
          ></label>
          <Input
            id="search-input" // Add an id to the Input component
            label="Search"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="w-full"
            onChange={searchHandler}
          />
        </div>
      </div>
    </CardHeader>
  );
};

BatchHeader.propTypes = {
  card: PropTypes.bool.isRequired,
  toggleHandler: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  searchHandler: PropTypes.func.isRequired,
  changeCardLayout: PropTypes.func.isRequired,
};

export default BatchHeader;
