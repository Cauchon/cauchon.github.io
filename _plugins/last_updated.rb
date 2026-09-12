require "open3"

# Read HEAD on every build, including incremental development rebuilds.
Jekyll::Hooks.register :site, :pre_render do |site|
  site.config.delete("last_updated")
  begin
    date, status = Open3.capture2e("git", "-C", site.source, "log", "-1", "--format=%cs")
    if status.success? && date.strip.match?(/\A\d{4}-\d{2}-\d{2}\z/)
      site.config["last_updated"] = date.strip
    else
      Jekyll.logger.warn "Last updated:", "Git commit date unavailable; omitting footer date."
    end
  rescue Errno::ENOENT
    Jekyll.logger.warn "Last updated:", "Git unavailable; omitting footer date."
  end
end
