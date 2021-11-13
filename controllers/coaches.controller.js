const trainingSessionRepository = require('../repository/training_session.repository');

class CoachController {

    async getSessions(req, res,next) {
        let coachId = req.params.coachId;
        try {
            let details = await trainingSessionRepository.getCoachSessions(coachId);
            res.status(200).json(details.recordset[0]);
        }
        catch (error) {
            next(error);
        }
    }
    async confirmTrainingSession(req, res, next) {
        const trainingSessionId = req.body.trainingSessionId;
        const coachId = req.body.coachId;
        const approved = req.body.approved;
        const date = new Date();
         try {
           let details = await trainingSessionRepository.confirmSession(coachId,trainingSessionId,approved,date);
           res.status(200).json({ coachId, trainingSessionId, approved, date });
         } catch (error) {
           next(error);
         }
    }
}

module.exports = new CoachController();