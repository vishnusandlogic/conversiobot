using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace ConversioBot
{
    public class TranslationService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public TranslationService(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        public async Task<string> TranslateTextAsync(string text, string targetLanguage = "en")
        {
            //start
            //var apiKey = _configuration["TranslationApiKey"];
            //var endpoint = _configuration["TranslationApiEndpoint"];
            //var version = _configuration["TranslationApiVersion"];


            //var url = $"{endpoint}/translate?api-version={version}&to={targetLanguage}";

            //_httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

            //var requestBody = new[] { new { Text = text } };
            //var content = new StringContent(JsonSerializer.Serialize(requestBody), System.Text.Encoding.UTF8, "application/json");

            //var response = await _httpClient.PostAsync(url, content);
            //end

            var endpoint = "https://api.coindesk.com/v1/bpi/currentprice.json";
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            //var translationResult = JsonSerializer.Deserialize<TranslationResult[]>(responseBody);

            //return translationResult?[0]?.Translations?[0]?.Text ?? text;
            return responseBody;
        }

        private class TranslationResult
        {
            public Translation[] Translations { get; set; }
        }

        private class Translation
        {
            public string Text { get; set; }
        }
    }
}
