import { useState, useEffect } from "react";
import { getAllFeelings } from "@api/FeelingsAPI";
import { getJustDate } from "@utils";
import { feelingListType } from "@src/global";
import { IFeelingItem } from "@src/models";

const useFeelingsData = (trigger: boolean) => {
  const [feelingsList, setFeelingsList] = useState<feelingListType>({});

  useEffect(() => {
    const fetchAndOrganizeFeelings = async () => {
      const allFeelings: IFeelingItem[] = await getAllFeelings();
      const feelingsByDates = allFeelings.reduce<feelingListType>((dates, feeling) => {
        const newDates = { ...dates };
        const formattedDate = getJustDate(new Date(feeling.date)).toString();
        if (newDates[formattedDate]) {
          newDates[formattedDate].push(feeling);
        } else {
          newDates[formattedDate] = [feeling];
        }
        return newDates;
      }, {});

      const todayString = getJustDate(new Date()).toString();
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
