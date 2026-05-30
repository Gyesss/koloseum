import { useEffect, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";

import { getEventById, deleteEvent } from "../../api/events";
import { getPosts } from "../../api/posts";

import {
  getTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "../../api/timelines";

import { getQnas, createQna, updateQna, deleteQna } from "../../api/qnas";

import EventHeader from "./components/EventHeader";
import EventTabs from "./components/EventTabs";
import TimelineSection from "./components/TimelineSection";
import QnaSection from "./components/QnaSection";
import PostsSection from "./components/PostsSection";

export default function EventDetail() {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [event, setEvent] = useState(null);

  const [posts, setPosts] = useState([]);

  const [timelines, setTimelines] = useState([]);

  const [qnas, setQnas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("timeline");

  const canManage = user?.role === "ADMIN" || user?.role === "ORGANIZER";

  useEffect(() => {
    const loadEventDetail = async () => {
      try {
        setLoading(true);

        const [eventResponse, postsResponse, timelinesResponse, qnasResponse] =
          await Promise.all([
            getEventById(eventId),
            getPosts(eventId),
            getTimelines(eventId),
            getQnas(eventId),
          ]);

        setEvent(eventResponse.data);

        setPosts(postsResponse.data || []);

        setTimelines(timelinesResponse.data || []);

        setQnas(qnasResponse.data || []);
      } catch (error) {
        console.error("Failed to load event detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEventDetail();
  }, [eventId]);

  async function handleDeleteEvent() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    try {
      await deleteEvent(eventId);

      navigate("/events");
    } catch (error) {
      console.error("Delete event failed:", error);

      alert("Failed to delete event");
    }
  }

  async function handleCreateTimeline(data) {
    try {
      const response = await createTimeline(eventId, data);

      setTimelines((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Create timeline failed:", error);

      alert("Failed to create timeline");
    }
  }

  async function handleUpdateTimeline(timelineId, data) {
    try {
      const response = await updateTimeline(eventId, timelineId, data);

      setTimelines((prev) =>
        prev.map((timeline) =>
          timeline.id === timelineId ? response.data : timeline,
        ),
      );
    } catch (error) {
      console.error("Update timeline failed:", error);

      alert("Failed to update timeline");
    }
  }

  async function handleDeleteTimeline(timelineId) {
    const confirmed = window.confirm("Delete this timeline?");

    if (!confirmed) return;

    try {
      await deleteTimeline(eventId, timelineId);

      setTimelines((prev) =>
        prev.filter((timeline) => timeline.id !== timelineId),
      );
    } catch (error) {
      console.error("Delete timeline failed:", error);

      alert("Failed to delete timeline");
    }
  }

  async function handleCreateQna(data) {
    try {
      const response = await createQna(eventId, data);

      setQnas((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Create QnA failed:", error);

      alert("Failed to create QnA");
    }
  }

  async function handleUpdateQna(qnaId, data) {
    try {
      const response = await updateQna(eventId, qnaId, data);

      setQnas((prev) =>
        prev.map((qna) => (qna.id === qnaId ? response.data : qna)),
      );
    } catch (error) {
      console.error("Update QnA failed:", error);

      alert("Failed to update QnA");
    }
  }

  async function handleDeleteQna(qnaId) {
    const confirmed = window.confirm("Delete this QnA?");

    if (!confirmed) return;

    try {
      await deleteQna(eventId, qnaId);

      setQnas((prev) => prev.filter((qna) => qna.id !== qnaId));
    } catch (error) {
      console.error("Delete QnA failed:", error);

      alert("Failed to delete QnA");
    }
  }

  if (loading) {
    return (
      <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <p className="text-text-soft">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center py-32 text-center">
          <h1 className="font-heading text-text text-3xl font-semibold">
            Event Not Found
          </h1>

          <p className="text-text-soft mt-3">
            The requested event does not exist.
          </p>

          <Link
            to="/events"
            className="bg-brand rounded-base mt-6 px-5 py-3 text-sm font-medium text-white"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-dvh px-4 py-8 pb-28 sm:px-6 md:pb-8 md:pl-28 lg:px-10 lg:pl-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full">
            <div className="text-brand mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.3em] uppercase">
              <FontAwesomeIcon icon={faCalendarDays} />
              <span>Event Hub</span>
            </div>

            <h1 className="font-heading text-text text-4xl font-semibold tracking-tight sm:text-5xl">
              Event Workspace
            </h1>

            <p className="text-text-soft mt-4 w-full text-base leading-7">
              Manage and view timelines, interactive QnA sessions, and featured
              informational posts for this Koloseum event.
            </p>
          </div>
        </div>

        <EventHeader
          event={event}
          canManage={canManage}
          onDelete={handleDeleteEvent}
        />

        <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "timeline" && (
          <TimelineSection
            timelines={timelines}
            canManage={canManage}
            onCreate={handleCreateTimeline}
            onUpdate={handleUpdateTimeline}
            onDelete={handleDeleteTimeline}
          />
        )}

        {activeTab === "qna" && (
          <QnaSection
            qnas={qnas}
            canManage={canManage}
            onCreate={handleCreateQna}
            onUpdate={handleUpdateQna}
            onDelete={handleDeleteQna}
          />
        )}

        {activeTab === "posts" && (
          <PostsSection posts={posts} eventId={eventId} canManage={canManage} />
        )}
      </div>
    </div>
  );
}
