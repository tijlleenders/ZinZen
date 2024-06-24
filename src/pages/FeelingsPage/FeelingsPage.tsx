/* eslint-disable react/no-array-index-key */
import { message } from "antd";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";

import SubHeader from "@src/common/SubHeader";
import LoadingContainer from "@src/common/LoadingContainer";

import { AddFeeling } from "@pages/FeelingsPage/components/AddFeeling";
import { IFeelingItem } from "@src/models";
import { displayAddFeeling } from "@src/store/FeelingsState";
import { fetchFeelings, updateFeeling } from "@src/api/FeelingsAPI";
import { getTitleForDate, groupFeelingsByDate } from "@src/utils/journal";

import Feeling from "./components/Feeling";
import NoteModal from "./components/NoteModal";

import "./FeelingsPage.scss";

export const FeelingsPage = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { displayNoteModal, note } = location.state || {};
  const showAddFeelingsModal = useRecoilValue(displayAddFeeling);

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery("feelings", fetchFeelings, {
    getNextPageParam: (lastPage) => (lastPage.feelings.length ? lastPage.nextPage : undefined),
  });
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  const renderFeelings = (feelingList: IFeelingItem[]) => {
    const groupedFeelings = groupFeelingsByDate(feelingList);
    return Object.keys(groupedFeelings).map((date) => (
      <div key={date}>
        <SubHeader title={getTitleForDate(new Date(date).toDateString())} />
        {groupedFeelings[date].map((feeling) => (
          <Feeling key={feeling.id} data={feeling} />
        ))}
      </div>
    ));
  };
  if (status === "error") {
    message.error("Something went wrong");
    window.history.back();
  }
  return (
    <>
      {status === "loading" && <LoadingContainer />}
      <div>{data && renderFeelings(data.pages.flatMap((page) => page.feelings))}</div>
      <div ref={loadMoreRef} />
      {displayNoteModal >= 0 && (
        <NoteModal
          open={displayNoteModal}
          defaultValue={note}
          saveNote={async (newNote = "") => {
            await updateFeeling(displayNoteModal, { note: newNote });
            queryClient.invalidateQueries("feelings");
            window.history.back();
          }}
        />
      )}
      {showAddFeelingsModal && <AddFeeling />}
    </>
  );
};
