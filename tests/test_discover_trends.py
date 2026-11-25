import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location("discover",Path(__file__).resolve().parents[1]/"scripts"/"discover-trends.py")
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class TrendTests(unittest.TestCase):
    def test_rss_titles(self):
        self.assertEqual(m.parse_feed(b'<rss><channel><item><title> AI  video </title><pubDate>Example</pubDate></item></channel></rss>'),[{"title":"AI video","published":"Example"}])
    def test_reject_dtd(self):
        with self.assertRaises(ValueError):
            m.parse_feed(b'<!DOCTYPE rss [<!ENTITY x "x">]><rss/>')
    def test_limit_items(self):
        self.assertEqual(len(m.parse_feed(b'<rss><channel>'+b'<item><title>X</title></item>'*40+b'</channel></rss>')),30)
    def test_reject_non_rss(self):
        with self.assertRaises(ValueError):
            m.parse_feed(b'<html/>')

if __name__=="__main__":
    unittest.main()
