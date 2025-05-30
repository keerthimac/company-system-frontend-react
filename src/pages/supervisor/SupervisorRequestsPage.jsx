// src/pages/supervisor/SupervisorRequestsPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaCalendarAlt,
} from "react-icons/fa";
import Modal from "../../components/common/Modal";

const SupervisorRequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: "TR001",
      machineName: "Excavator XG-2000",
      machineId: "M001",
      fromSite: "Site B",
      toSite: "Site A",
      requestor: "PM Site B",
      requestedDate: "2024-05-25",
      status: "Pending",
    },
    {
      id: "TR002",
      machineName: "Crane LFT-500",
      machineId: "M002",
      fromSite: "Site C",
      toSite: "Site A",
      requestor: "Self (Site A)",
      requestedDate: "2024-05-22",
      status: "Approved",
      approvedDate: "2024-05-23",
      scheduledTransferDate: "",
    },
    {
      id: "TR003",
      machineName: "Bulldozer BD-150",
      machineId: "M003",
      fromSite: "Site A",
      toSite: "Site D",
      requestor: "Self (Site A)",
      requestedDate: "2024-05-20",
      status: "Rejected",
      rejectedDate: "2024-05-21",
      reason: "Not available",
    },
    {
      id: "TR004",
      machineName: "Generator GEN-50KVA",
      machineId: "M004",
      fromSite: "Central Store",
      toSite: "Site B",
      requestor: "PM Site B",
      requestedDate: "2024-05-28",
      status: "Pending",
    },
    {
      id: "TR005",
      machineName: "Road Roller RR-10T",
      machineId: "M005",
      fromSite: "Site A",
      toSite: "Site C",
      requestor: "PM Site C",
      requestedDate: "2024-05-15",
      status: "Transferred",
      approvedDate: "2024-05-16",
      scheduledTransferDate: "2024-05-20",
      actualTransferDate: "2024-05-20",
    },
  ]);

  const [filteredRequests, setFilteredRequests] = useState(requests);
  const [statusFilter, setStatusFilter] = useState("");

  const [requestToManage, setRequestToManage] = useState(null);

  // Modal States
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  useEffect(() => {
    if (statusFilter === "" || statusFilter === "All") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((req) => req.status === statusFilter)
      );
    }
  }, [statusFilter, requests]);

  const getStatusClassAndIcon = (status) => {
    switch (status) {
      case "Pending":
        return {
          class: "badge-warning",
          icon: <FaFilter className="mr-1 inline" />,
        };
      case "Approved":
        return {
          class: "badge-success",
          icon: <FaCheckCircle className="mr-1 inline" />,
        };
      case "Rejected":
        return {
          class: "badge-error",
          icon: <FaTimesCircle className="mr-1 inline" />,
        };
      case "Transferred":
        return {
          class: "badge-info",
          icon: <FaTruck className="mr-1 inline" />,
        };
      default:
        return { class: "badge-neutral", icon: null };
    }
  };

  const openAcceptModal = (request) => {
    setRequestToManage(request);
    setIsAcceptModalOpen(true);
  };

  const confirmAcceptRequest = () => {
    if (!requestToManage) return;
    console.log(`Accepting request ${requestToManage.id}`);
    alert(`Request ${requestToManage.id} accepted.`);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestToManage.id
          ? {
              ...r,
              status: "Approved",
              approvedDate: new Date().toISOString().split("T")[0],
              reason: "",
              scheduledTransferDate: "",
            }
          : r
      )
    );
    setIsAcceptModalOpen(false);
    setRequestToManage(null);
  };

  const openRejectModal = (request) => {
    setRequestToManage(request);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleSubmitRejection = (e) => {
    e.preventDefault();
    if (!requestToManage) return;
    console.log(
      `Rejecting request ${requestToManage.id}. Reason: ${rejectionReason}`
    );
    alert(
      `Request ${requestToManage.id} rejected. Reason: ${
        rejectionReason || "N/A"
      }`
    );
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestToManage.id
          ? {
              ...r,
              status: "Rejected",
              rejectedDate: new Date().toISOString().split("T")[0],
              reason: rejectionReason || "N/A",
            }
          : r
      )
    );
    setIsRejectModalOpen(false);
    setRequestToManage(null);
  };

  const openScheduleModal = (request) => {
    setRequestToManage(request);
    setScheduleDate(
      request.scheduledTransferDate || new Date().toISOString().split("T")[0]
    );
    setIsScheduleModalOpen(true);
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (!requestToManage) return;
    console.log(
      `Scheduling transfer for ${requestToManage.id} on ${scheduleDate}`
    );
    alert(`Transfer for ${requestToManage.id} scheduled for ${scheduleDate}`);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestToManage.id
          ? { ...r, scheduledTransferDate: scheduleDate, status: "Approved" }
          : r
      )
    );
    setIsScheduleModalOpen(false);
    setRequestToManage(null);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="card-title text-2xl text-primary mb-4 sm:mb-0">
              Machine Transfer Requests (Supervisor)
            </h2>
          </div>

          <div className="mb-6 p-4 bg-base-200 rounded-lg">
            <div className="form-control w-full sm:w-auto md:w-1/3">
              <label className="label pb-1 pt-0">
                <span className="label-text">Filter by Status</span>
              </label>
              <select
                className="select select-bordered w-full focus:border-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Transferred">Transferred</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Req. ID</th>
                  <th>Machine (ID)</th>
                  <th>From Site</th>
                  <th>To Site</th>
                  <th>Requestor</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => {
                    const statusStyle = getStatusClassAndIcon(req.status);
                    return (
                      <tr key={req.id} className="hover">
                        <td className="font-semibold text-primary">{req.id}</td>
                        <td>
                          <div>{req.machineName}</div>
                          <div className="text-xs opacity-70">
                            ({req.machineId})
                          </div>
                        </td>
                        <td>{req.fromSite}</td>
                        <td>{req.toSite}</td>
                        <td>{req.requestor}</td>
                        <td>{req.requestedDate}</td>
                        <td>
                          <span
                            className={`badge ${statusStyle.class} badge-md flex items-center`}
                          >
                            {statusStyle.icon} {req.status}
                          </span>
                          {req.status === "Approved" &&
                            req.scheduledTransferDate && (
                              <div className="text-xs opacity-70 mt-1">
                                Sch: {req.scheduledTransferDate}
                              </div>
                            )}
                          {req.status === "Rejected" && req.reason && (
                            <div className="text-xs opacity-70 mt-1">
                              Reason: {req.reason}
                            </div>
                          )}
                        </td>
                        <td className="space-x-1 whitespace-nowrap">
                          {req.status === "Pending" && (
                            <>
                              <button
                                className="btn btn-xs btn-outline btn-success"
                                onClick={() => openAcceptModal(req)}
                                title="Accept Request"
                              >
                                <FaCheckCircle /> Accept
                              </button>
                              <button
                                className="btn btn-xs btn-outline btn-error"
                                onClick={() => openRejectModal(req)}
                                title="Reject Request"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </>
                          )}
                          {req.status === "Approved" &&
                            !req.scheduledTransferDate && ( // Only show schedule if not already scheduled
                              <button
                                className="btn btn-xs btn-outline btn-info"
                                onClick={() => openScheduleModal(req)}
                                title="Schedule Transfer"
                              >
                                <FaCalendarAlt /> Schedule
                              </button>
                            )}
                          {(req.status === "Rejected" ||
                            req.status === "Transferred" ||
                            (req.status === "Approved" &&
                              req.scheduledTransferDate)) && (
                            <span className="text-xs text-base-content/60 italic">
                              {req.status === "Approved" &&
                              req.scheduledTransferDate
                                ? "Scheduled"
                                : "No actions"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      No transfer requests found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Accept Request Confirmation Modal */}
      <Modal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title={`Confirm Acceptance: ${requestToManage?.id || ""}`}
      >
        {requestToManage && (
          <div className="p-3 text-sm space-y-2">
            <p>Are you sure you want to accept the transfer request for:</p>
            <div className="p-3 bg-base-200 rounded-md">
              <p>
                <strong>Machine:</strong> {requestToManage.machineName} (
                {requestToManage.machineId})
              </p>
              <p>
                <strong>From:</strong> {requestToManage.fromSite} &rarr;{" "}
                <strong>To:</strong> {requestToManage.toSite}
              </p>
              <p>
                <strong>Requested by:</strong> {requestToManage.requestor} on{" "}
                {requestToManage.requestedDate}
              </p>
            </div>
          </div>
        )}
        <div className="modal-action mt-6 pt-4 border-t border-base-300">
          <button
            type="button"
            onClick={() => setIsAcceptModalOpen(false)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmAcceptRequest}
            className="btn btn-success"
          >
            <FaCheckCircle className="mr-2" /> Confirm Acceptance
          </button>
        </div>
      </Modal>

      {/* Reject Request Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title={`Reject Request: ${requestToManage?.id || ""}`}
      >
        <form onSubmit={handleSubmitRejection} className="space-y-4">
          {requestToManage && (
            <div className="p-3 bg-base-200 rounded-md text-sm space-y-1">
              <p>
                <strong>Machine:</strong> {requestToManage.machineName} (
                {requestToManage.machineId})
              </p>
              <p>
                <strong>From:</strong> {requestToManage.fromSite} &rarr;{" "}
                <strong>To:</strong> {requestToManage.toSite}
              </p>
              <p>
                <strong>Requested by:</strong> {requestToManage.requestor} on{" "}
                {requestToManage.requestedDate}
              </p>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Reason for Rejection (Optional)
              </span>
            </label>
            <textarea
              name="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="textarea textarea-bordered w-full h-24 focus:border-primary"
              placeholder="Enter reason..."
            ></textarea>
          </div>
          <div className="modal-action mt-6 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => setIsRejectModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-error">
              <FaTimesCircle className="mr-2" /> Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedule Transfer Modal */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={`Schedule Transfer: ${requestToManage?.id || ""}`}
      >
        <form onSubmit={handleSubmitSchedule} className="space-y-4">
          {requestToManage && (
            <div className="p-3 bg-base-200 rounded-md text-sm space-y-1">
              <p>
                <strong>Machine:</strong> {requestToManage.machineName} (
                {requestToManage.machineId})
              </p>
              <p>
                <strong>From:</strong> {requestToManage.fromSite} &rarr;{" "}
                <strong>To:</strong> {requestToManage.toSite}
              </p>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Scheduled Transfer Date</span>
            </label>
            <input
              type="date"
              name="scheduleDate"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="input input-bordered w-full focus:border-primary"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="modal-action mt-6 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaCalendarAlt className="mr-2" /> Confirm Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupervisorRequestsPage;
