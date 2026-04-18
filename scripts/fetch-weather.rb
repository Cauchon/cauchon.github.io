#!/usr/bin/env ruby
# Fetches current Portland, OR weather from Open-Meteo and writes
# _data/weather.yml so Jekyll can render it at build time.

require 'net/http'
require 'json'
require 'yaml'
require 'uri'
require 'time'
require 'fileutils'

LAT = 45.5152
LON = -122.6784
TZ  = "America/Los_Angeles"

url = "https://api.open-meteo.com/v1/forecast" \
      "?latitude=#{LAT}&longitude=#{LON}" \
      "&current=temperature_2m,weather_code,is_day" \
      "&daily=sunrise,sunset" \
      "&forecast_days=2" \
      "&temperature_unit=fahrenheit" \
      "&timezone=#{TZ}"

response = Net::HTTP.get_response(URI(url))
raise "Open-Meteo request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

payload = JSON.parse(response.body)
current = payload.fetch("current")
daily   = payload.fetch("daily")
code    = current["weather_code"].to_i
is_day  = current["is_day"].to_i == 1

# WMO weather code → [description, icon]
codes = {
  0  => ["clear skies",         "☀︎"],
  1  => ["mostly clear",        "☀︎"],
  2  => ["partly cloudy",       "⛅︎"],
  3  => ["overcast",            "☁︎"],
  45 => ["foggy",               "☁︎"],
  48 => ["icy fog",             "☁︎"],
  51 => ["drizzling lightly",   "☂︎"],
  53 => ["drizzling",           "☂︎"],
  55 => ["drizzling hard",      "☂︎"],
  56 => ["freezing drizzle",    "❄︎"],
  57 => ["freezing drizzle",    "❄︎"],
  61 => ["raining lightly",     "☂︎"],
  63 => ["raining",             "☂︎"],
  65 => ["pouring",             "☂︎"],
  66 => ["freezing rain",       "❄︎"],
  67 => ["freezing rain",       "❄︎"],
  71 => ["snowing lightly",     "❄︎"],
  73 => ["snowing",             "❄︎"],
  75 => ["snowing hard",        "❄︎"],
  77 => ["snow grains",         "❄︎"],
  80 => ["rain showers",        "☂︎"],
  81 => ["rain showers",        "☂︎"],
  82 => ["heavy rain showers",  "☂︎"],
  85 => ["snow showers",        "❄︎"],
  86 => ["snow showers",        "❄︎"],
  95 => ["thunderstorming",     "⚡︎"],
  96 => ["thundering with hail","⚡︎"],
  99 => ["thundering with hail","⚡︎"]
}

description, icon = codes[code] || ["weathering", "☁︎"]
icon = "☾" if !is_day && code <= 1

# Pick the next upcoming sun event (sunrise or sunset), relative to "now" in Portland.
now        = Time.parse(current["time"])
sunrises   = daily["sunrise"].map { |t| Time.parse(t) }
sunsets    = daily["sunset"].map  { |t| Time.parse(t) }
events     = (sunrises.map { |t| [t, "sunrise"] } + sunsets.map { |t| [t, "sunset"] })
             .sort_by(&:first)
next_event = events.find { |t, _| t > now } || events.last
sun_time, sun_label = next_event

# Format like "6:21 am" — zero-padded minutes, lowercase meridiem, no leading zero on hour.
formatted = sun_time.strftime("%-I:%M %p").downcase

weather = {
  "temperature"  => current["temperature_2m"].round,
  "description"  => description,
  "icon"         => icon,
  "code"         => code,
  "is_day"       => is_day,
  "sun_label"    => sun_label,
  "sun_time"     => formatted,
  "updated_at"   => current["time"]
}

FileUtils.mkdir_p("_data")
File.write("_data/weather.yml", weather.to_yaml)
puts "Wrote _data/weather.yml: #{weather.inspect}"
