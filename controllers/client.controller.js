const trainingSessionRepository = require("../repository/training_session.repository");

class ClientController {
    async postNewTrainingSessionRequest(req, res, next) {
        const coachId = req.body.coachId;
        const clientId = req.body.clientId;
        const sessionDate = req.body.sessionDate;
        const startTime = req.body.startTime;
        const sessionNo = req.body.sessionNo;

         try {
           let details = await trainingSessionRepository.postNewSessionRequest(
             coachId,clientId,sessionDate,startTime,sessionNo
           );
           console.log(details)
           res.status(200).json(details.recordset[0]);
         } catch (error) {
           next(error);
         }
  }
  
  async paySession(req, res, next) {
    const paySlipId = req.body.paySlipId;
    const clientId = req.body.clientId;
    const trainingSessionId = req.body.trainingSessionId;
    const amount = req.body.amount;
    const payedDate = new Date().toISOString();

    try {
      await trainingSessionRepository.paySession(
        paySlipId,
        clientId,
        trainingSessionId,
        amount,
        payedDate
      );
      res
        .status(200)
        .json({ paySlipId, clientId, trainingSessionId, amount, payedDate });
    } catch (error) {
      next(error);
    }
  }
}


module.exports = new ClientController();