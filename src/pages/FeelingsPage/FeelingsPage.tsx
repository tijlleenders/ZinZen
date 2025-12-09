/* eslint-disable react/no-array-index-key */
import { message } from "antd";
import { useRouterState } from "@tanstack/react-router";
import React, { useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";

import SubHeader from "@src/common/SubHeader";
import LoadingContainer from "@src/common/LoadingContainer";

import { AddFeeling } from "@pages/FeelingsPage/components/AddFeeling";
import { IFeelingItem } from "@src/models";
import { fetchFeelings, updateFeeling } from "@src/api/FeelingsAPI";
import { getTitleForDate, groupFeelingsByDate } from "@src/utils/journal";

import Feeling from "./components/Feeling";
import NoteModal from "./components/NoteModal";

import "./FeelingsPage.scss";

export const FeelingsPage = ({ showAddFeelingsModal }: { showAddFeelingsModal: boolean }) => {
  const queryClient = useQueryClient();
  const displayNoteModal = useRouterState({
    select: (state) => state.location.state.displayNoteModal,
  });
  const note = useRouterState({
    select: (state) => state.location.state.note,
  });

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
      {displayNoteModal && !!displayNoteModal && (
        <NoteModal
          open={!!displayNoteModal}
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
