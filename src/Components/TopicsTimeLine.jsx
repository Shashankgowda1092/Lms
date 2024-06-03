import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  Typography,
  TimelineHeader,
} from "@material-tailwind/react";
import {
  CircularProgressbar,


  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BellIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import { easeQuadInOut } from "d3-ease";


export function TopicsTimeLine(props) {
  return (
    <div className="w-full">
      <Timeline>
        {props.topics.map((data, key) => (
          <TimelineItem key={key} className="min-h-20 mt-5">
            <TimelineConnector className="mt-6 !w-[150px ] " />
            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
              <TimelineIcon className="p-0 h-[3.3rem] w-[3.3rem]" variant="ghost">
                <AnimatedProgressProvider
                  valueStart={0}
                  valueEnd={data.progress}
                  duration={0.5}
                  easingFunction={easeQuadInOut}
                  repeat
                >
                  {value => {
                    const roundedValue = Math.round(value);
                    return (
                      <CircularProgressbar
                        value={value}
                        text={`${roundedValue}%`}
                        /* This is important to include, because if you're fully managing the
                  animation yourself, you'll want to disable the CSS animation. */
                        // styles={buildStyles({ pathTransition: "none" })}
                      />
                    );
                  }}
                </AnimatedProgressProvider>

              </TimelineIcon>
              <div className="flex flex-col gap-1">
                <Typography variant="h6" color="blue-gray">
                  {data.topicName}
                </Typography>

             
              </div>
            </TimelineHeader>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
