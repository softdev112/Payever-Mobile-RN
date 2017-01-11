# Original https://github.com/rambler-ios/fastlane-flows/blob/master/fastlane/actions/telegram.rb

module Fastlane
  module Actions
    class TelegramAction < Action
      def self.run(params)
        text = params[:text]
        bot_token = params[:bot_token]
        chat_id = params[:chat_id]

        uri = URI("https://api.telegram.org/bot#{bot_token}/sendMessage")
        params = { :text => text, :chat_id => chat_id }
        uri.query = URI.encode_www_form(params)
        Net::HTTP.get(uri)
      end

      #####################################################
      # @!group Documentation
      #####################################################

      def self.description
        'Sends a message to Telegram chat'
      end

      def self.available_options
        [
          FastlaneCore::ConfigItem.new(
            key: :text,
            env_name: 'FL_TELEGRAM_TEXT',
            description: 'The message text',
            is_string: true,
            default_value: ''
          ),
		  FastlaneCore::ConfigItem.new(
		    key: :bot_token,
		    env_name: 'FL_TELEGRAM_BOT_TOKEN',
		    description: 'Telegram bot token',
		    is_string: true,
		    default_value: ''
		  ),
		  FastlaneCore::ConfigItem.new(
		    key: :chat_id,
		    env_name: 'FL_TELEGRAM_CHAT_ID',
		    description: 'Telegram chat id',
		    is_string: true,
		    default_value: ''
		  )
        ]
      end

      def self.output
        [
          ['TELEGRAM_TEXT', 'The message text']
        ]
      end

      def self.authors
        ['megahertz']
      end

      def self.is_supported?(platform)
        true
      end
    end
  end
end