import { useState, useEffect } from "react";
import { getAllFeelings } from "@api/FeelingsAPI";
import { getDates, getJustDate } from "@utils";
import { feelingListType } from "@src/global";

const useFeelingsData = (trigger: boolean) => {
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);

  useEffect(() => {
    const fetchAndOrganizeFeelings = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates = allFeelings.reduce((dates, feeling) => {
        const newDates = { ...dates };
        const formattedDate = getJustDate(feeling.date);
        if (newDates[formattedDate]) {
          newDates[formattedDate].push(feeling);
        } else {
          newDates[formattedDate] = [feeling];
        }
        return newDates;
      }, {});

      const dateArr = Object.keys(feelingsByDates).map((date) => date);
      const dateRangeArr = getDates(new Date(dateArr[0]), new Date());
      if (dateRangeArr.length === 0) {
        dateRangeArr.push(new Date());
      }
      const todayString = getJustDate(new Date());
      if (!feelingsByDates[todayString]) {
        feelingsByDates[todayString] = [];
      }

      setFeelingsList(feelingsByDates);
    };

    fetchAndOrganizeFeelings();
  }, [trigger]);

  return { feelingsList, setFeelingsList };
};

export default useFeelingsData;
