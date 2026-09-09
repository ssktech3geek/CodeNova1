import unittest

from pydantic import ValidationError

from main import Activity, PipelineRequest, Traveler, _fallback_scores, _optimize


class PipelineValidationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.activity = Activity(
            id="ACT_01",
            name="Hike",
            tag="hiking",
            cost=45,
            duration_min=60,
            intensity=4,
        )
        self.traveler = Traveler(budget=200, interests=["hiking"])

    def test_rejects_locked_and_excluded_activity(self) -> None:
        with self.assertRaises(ValidationError):
            PipelineRequest(
                traveler=self.traveler,
                activities=[self.activity],
                max_budget=200,
                locked_activity_ids=["ACT_01"],
                excluded_activity_ids=["ACT_01"],
            )

    def test_fallback_scores_each_activity(self) -> None:
        scores = _fallback_scores([self.activity], self.traveler)
        self.assertEqual(len(scores), 1)
        self.assertGreater(float(scores[0]), 0)

    def test_optimizer_selects_a_feasible_activity(self) -> None:
        request = PipelineRequest(
            traveler=self.traveler,
            activities=[self.activity],
            max_budget=200,
        )
        itinerary = _optimize(request, [0.8])
        self.assertEqual([item["id"] for item in itinerary], ["ACT_01"])


if __name__ == "__main__":
    unittest.main()
