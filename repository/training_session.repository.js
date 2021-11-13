const BaseRepository = require("./base.repository");

class TrainingSession extends BaseRepository {
  constructor() {
    super("dev");
  }

  async getCoachSessions(coachId) {
    return super.execute(
      "dbo.usp_CoachSessions_GetAllBy",
      { coachId, fromDate: null, toDate: null },
      null
    );
  }

  async postNewSessionRequest(
    coachId,
    clientId,
    sessionDate,
    startTime,
    sessionNo
  ) {
    return super.execute(
      "dbo.usp_TrainingSession_Insert",
      {
        coachId,
        clientId,
        sessionDate,
        startTime,
        sessionNo,
      },
      null
    );
  }

  async confirmSession(coachId, trainingSessionId, approved, aproveDate) {
    return super.execute(
      "dbo.usp_TrainingSessionCoachesResponse",
      {
        coachId,
        trainingSessionId,
        approved,
        aproveDate,
      },
      null
    );
  }

  async paySession(paySlipId, clientId, trainingSessionId, amount, payedDate) {
    return super.execute(
      "dbo.usp_PaySlip_Pay ",
      {
        paySlipId,
        clientId,
        trainingSessionId,
        amount,
        payedDate,
      },
      null
    );
  }
}

module.exports = new TrainingSession();
