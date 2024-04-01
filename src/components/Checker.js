import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CheckArea from '../tc_ui_toolkit/VerseCheck/CheckArea'
import ActionsArea from '../tc_ui_toolkit/VerseCheck/ActionsArea'
import GroupMenuComponent from './GroupMenuComponent'

// const tc = require('../__tests__/fixtures/tc.json')
// const toolApi = require('../__tests__/fixtures/toolApi.json')
//
// const lexiconCache_ = {};

const styles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    // width: '100vw',
    height: '50%',
  },
  centerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '85%',
    overflowX: 'auto',
  },
  scripturePaneDiv: {
    display: 'flex',
    flexShrink: '0',
    height: '250px',
    paddingBottom: '20px',
  },
};

console.log('Checker.js - startup')
const name = 'Checker'

const selections = [
  {
    "text": "desire",
    "occurrence": 1,
    "occurrences": 1
  }
];

const Checker = ({
 translate,
}) => {
  const [state, _setState] = useState({
    nothingToSelect: false,
    localNothingToSelect: false,
    mode: 'default',
    newSelections: selections,
  })

  const {
    nothingToSelect,
    localNothingToSelect,
    mode,
    newSelections,
  } = state

  function setState(newState) {
    _setState(prevState => ({ ...prevState, ...newState }))
  }

  const contextId =
  {
    "reference": {
    "bookId": "1jn",
      "chapter": 2,
      "verse": 17
  },
    "tool": "translationWords",
    "groupId": "age",
    "quote": "αἰῶνα",
    "strong": [
    "G01650"
  ],
    "lemma": [
    "αἰών"
  ],
    "occurrence": 1
  }

  const tags = [];
  const commentText = '';
  const verseText = 'The people who do not honor God will disappear, along with all of the things that they desire. But the people who do what God wants them to do will live forever!';
  const invalidated = false;
  const bookDetails = {
    "id": "1jn",
    "name": "1 John"
  };
  const targetBible = {
    "1": {
      "1": "{I, John, am writing to you} about {Jesus,} the Word {of God}, the one who gives life. He existed before there was anything else. We {apostles} listened to him {as he taught people}. We saw him personally. We looked at him and touched him. {So we can testify that he was a real human being.}",
      "2": "Because he came here to the earth and we saw him, we are proclaiming him to you clearly. The one who has always existed, who had been with his Father in heaven, came here to us.\n\n\\ts\\*",
      "3": "We want you to share life with us, and so we are proclaiming to you what we saw {Jesus do} and what we heard {Jesus say}. {If you believe in him,} you will share life, as we do, with God our Father and with his Son Jesus the Messiah.",
      "4": "I am writing to you about these things so that {you will recognize that they are true, and that as a result} we will be completely joyful together.\n\n\\ts\\*\n\\p",
      "5": "The message that we heard from Jesus and are proclaiming to you is this: God always does what is right, and he never, ever does anything wrong. He is like a pure light in which there is no darkness at all.",
      "6": "If we say that we share life with God, but we live in an evil manner, we are lying. We are not living truthfully. It is as though we are living in the dark.",
      "7": "But if we live in a pure manner, as God is pure in every way, then we can share life with each other. This is like living in God’s pure light. Then God forgives all of our sin and accepts us because his Son Jesus died for us.\n\n\\ts\\*",
      "8": "If we say that we do not commit sin, we are fooling ourselves. We are refusing to believe the true things {that God says about us}.",
      "9": "But God always does what he says he will do, and what he does is always right. So if we admit to him that we have sinned {and reject that sin}, he will forgive us for our sins and he will free us from {the guilt of} everything that we have done wrong.",
      "10": "{Because God says that everyone has sinned,} if we say that we have not sinned, we are speaking as if God were a liar! We are rejecting what God has said about us!\n\n\\ts\\*",
      "front": "\\p"
    },
    "2": {
      "1": "You are as dear to me as though you were my own children. Therefore, I am writing this to you to keep you from sinning. But if any of you does sin, {remember that} Jesus the Messiah, the righteous one, pleads with the Father {and asks him to forgive us}.",
      "2": "Jesus is the one who sacrificed his life for us so that God could forgive our sins. And this is true not just of our sins, but of all the sins that all people everywhere have committed!\n\\p",
      "3": "When we obey what God commands us to do, then we can be sure that we have come to have a close relationship with God.\n\n\\ts\\*",
      "4": "If someone says, “I am living in close relationship with God,” but that person does not obey what God has commanded, then he is a liar. He is not conducting his life according to God’s true message.",
      "5": "But if someone obeys what God has commanded, that person loves God in every way. This is how we can be sure that we have a close relationship with God:",
      "6": "If anyone says that he has a close relationship with God, then he should conduct his life as Jesus did {when he was here on earth}.\n\n\\ts\\*\n\\p",
      "7": "Dear friends, I am not writing this to tell you to do something new. Instead, I am writing this to tell you to do something that you have known that you should do since you first believed {in Jesus}. This is {part of} the message that {Jesus gave to us and that} we have already told to you.",
      "8": "However, if we think about this in another way, I am telling you to do something new. It is new because the way that the Messiah lived was new, and the way that you are living is new. That is because you are ceasing to do evil and you are doing good more and more. It is as though you have come out of a dark place and have begun to live in light from God.\n\n\\ts\\*",
      "9": "Someone might say that he is living in a good way, just as God wants him to do. That would be like living in light from God. But if he hates any of his fellow believers, then he is still living in a bad way, doing what God does not want, like a person who lives in darkness.",
      "10": "But if someone loves his fellow believers, then he is truly living well, like a person who is living in light from God. He will not have a reason to do anything evil {as he would have if he hated a fellow believer}. This is like a person in daylight who has no reason to trip over anything.",
      "11": "But anyone who hates a fellow believer is living in a completely wrong way. He does not understand how he should live, because the wrong things that he is doing are keeping him from understanding God’s way. It is as though he is walking in darkness, and cannot see where to go.\n\n\\ts\\*\n\\p",
      "12": "I am writing to you, whom I love as though you were my own children, because God has forgiven your sins because of what Jesus has done for you.",
      "13": "I am writing to you who have been believers longer than the others. I am writing to you because you have a close relationship with {Jesus,} the person who has always been alive. I am writing to you newer but steadfast believers because Satan, that evil being, has tried to tempt you to do wrong, but you have successfully resisted him.",
      "14": "I have written to you whom I love as though you were my own little children because you have a close relationship with God the Father. I have written to you who have been believers longer than the others because you have a close relationship with {Jesus,} the person who has always been alive. I have written to you newer but steadfast believers because you are spiritually strong. I have also written to you because you continue to obey what God commands, and because you have successfully resisted {Satan,} that evil being{,} when he tried to tempt you to do wrong.\n\n\\ts\\*\n\\p",
      "15": "Do not desire to be like people who do not honor God. Do not desire the things that they want to have. If anyone desires to be like those people, {he is proving that} he does not love God the Father.",
      "16": "{I say that such a person does not love God the Father} because the way that ungodly people live is not the way that God our Father teaches us to live. They want to fulfill their physical desires. They want to get for themselves the things that they see. They boast about all of the things that they own. All of these things come from the selfish and ungodly way of thinking.",
      "17": "The people who do not honor God will disappear, along with all of the things that they desire. But the people who do what God wants them to do will live forever!\n\n\\ts\\*\n\\p",
      "18": "You who are as dear to me as though you were my own children, {I want you to know that} this is the time just before Jesus returns to earth. You have already heard that a person is coming who will strongly oppose the Messiah. In fact, many people like that, who are against the true Messiah, are already here. Because of this, we know that it is that time.",
      "19": "These people refused to remain in our congregations. However, they never really belonged with us in the first place. After all, if they had belonged with us, they would not have left us. But {when they left us,} then we clearly saw that none of them had actually joined with us.\n\n\\ts\\*",
      "20": "But as for you, the Holy Messiah has given you his Spirit. As a result, you all know {what is true}.",
      "21": "I am not writing this letter to you because you do not know the true things {that God has told us}, but because you do know them. You also know enough to recognize and reject every lie that is not one of the true things {that God has told us}.\n\n\\ts\\*",
      "22": "The worst liars are the ones who deny that Jesus is the Messiah. All who do that are against the Messiah. They are refusing to believe both in God the Father and in Jesus his Son.",
      "23": "Those who refuse to acknowledge that Jesus is God’s Son are in no way joined with God the Father. But those who acknowledge that Jesus is God’s Son are also joined with God the Father.\n\n\\ts\\*",
      "24": "Here is what you must do{, unlike those people who deny Jesus}. You must continue to believe and live by the truth about Jesus the Messiah that you first heard. If you continue to believe and live by the truth about Jesus the Messiah that you first heard, then you will continue to share life with Jesus the Son and God the Father.",
      "25": "And what God promised us is that he will enable us to live forever!\n\\p",
      "26": "I am writing this letter to you to warn you about people who want to deceive you {about Jesus}.\n\n\\ts\\*",
      "27": "Here is what you should do {about those people who are trying to deceive you}. God’s Spirit, whom you received from Jesus, continues to live in you. So you do not need anyone else to be your teacher. God’s Spirit is teaching you everything that you need to know. He always teaches the truth, and never says anything that is false. So continue to live in the way that he has taught you, and continue to share life with Jesus.\n\\p",
      "28": "Now, my dear ones, {I urge you to} continue to share life with Jesus. That way, when he comes back again, we will be confident {that he will accept us}. {If we do that,} we will not be ashamed to stand before him when he returns.",
      "29": "Since you know that God always does what is right, you know that all those who continue doing what is right are the ones who have become God’s spiritual children.\n\n\\ts\\*",
      "front": "\\p"
    },
    "3": {
      "1": "Think about how much God our Father loves us! He says that we are his children. In a spiritual sense, this is completely true. That is why people who are unbelievers do not understand us. It is because they have not understood who God is{, and we take after him just as children take after their parents}.",
      "2": "Dear friends, at present we are God’s spiritual children. He has not yet shown us what we will be {in the future}. {However,} we know that when Jesus comes back again, we will become like him, because we will see him as he truly is.",
      "3": "So all those who confidently expect to see Jesus as he truly is make themselves free from sin because Jesus himself is free from sin.\n\n\\ts\\*",
      "4": "But everyone who continues to sin is refusing to obey God’s laws, because that is what sin is, refusing to obey God’s laws.",
      "5": "You know that Jesus came in order to make us free from our sins. {You know} also {that} he never sinned himself.",
      "6": "Those who share life with Jesus do not continue sinning. But all those who continue to sin have not understood who Jesus is and they do not really know him.\n\n\\ts\\*",
      "7": "So I urge you who are very dear to me not to let anyone deceive you {by telling you that it is all right to sin}. If you continue doing what is right, that will please God, just as Jesus always does what pleases God.",
      "8": "But anyone who continues to sin is behaving like the devil, because the devil has always been sinning, ever since the world began. The very reason that God’s Son became a human being was to undo this work of the devil {that kept people continually sinning}.\n\n\\ts\\*",
      "9": "People do not continue sinning if they have become spiritual children of God because God has made them to be like him. They cannot continually sin, because they are God’s spiritual children.",
      "10": "People who belong to God are clearly different from people who belong to the devil. Those who do not do what is right do not belong to God. Those who do not love their fellow believers also do not belong to God.\n\n\\ts\\*\n\\p",
      "11": "{You should recognize this because} the message that you heard when you first believed in Jesus is that we should love each other.",
      "12": "We should not hate others as {Adam’s son} Cain did. He belonged to {Satan,} that evil being. Cain murdered his {younger} brother {Abel}. I will tell you why he did that. It was because Cain behaved in an evil way, and {he hated his younger brother because} his younger brother behaved in the right way.\n\n\\ts\\*",
      "13": "Therefore, my fellow believers, you should not be amazed when unbelievers hate you.",
      "14": "We love our fellow believers, and this assures us that God has made us spiritually alive. But if someone does not love {other believers}, then that person is still spiritually dead.",
      "15": "Anyone who hates one of his fellow believers is doing something just as bad as murdering him. And you know that someone who murders another person is not living in the new way that God enables us to live.\n\n\\ts\\*",
      "16": "Jesus taught us how to truly love each other when he willingly died for us. For our part, we should also be willing to do anything for our fellow believers, even die for them.",
      "17": "Many of us have the things that are necessary for life in this world. But supppose that we become aware that a fellow believer does not have what he needs. Suppose also that we refuse to provide for him. Then we are not loving him the way that God taught us to love {people}.",
      "18": "You who are as dear to me as though you were my own children, let us not {merely} say that we love {each other}. Let us love {each other} genuinely by helping {each other}.\n\n\\ts\\*\n\\p",
      "21": "Dear friends, when we feel that God does not condemn us {for having sinned}, then we can pray confidently to God.",
      "22": "We find that when we pray confidently to God and ask for something, he gives it to us. {We pray confidently like this} because {as people who belong to him,} we do what he commands us to do and we do what pleases him.\n\n\\ts\\*",
      "23": "I will tell you what God commands us to do. We must trust in his Son, Jesus the Messiah. We must also love each other just as Jesus commanded us to do.",
      "24": "The people who do what God commands share life with God, and God shares life with them. I will tell you how we can be sure that God is sharing life with us. We can be sure of that because we have God’s Spirit, whom he gave to us.\n\n\\ts\\*",
      "front": "\\p",
      "19-20": "By doing that, we can know that we belong to God, who is the source of everything that is true. When we are in God’s presence we may feel that we do not belong to God because of our sins. When that happens, we can reassure ourselves that we truly do belong to him. This is because God is more trustworthy than our feelings and he knows everything about us{, including that we have trusted in him}."
    },
    "4": {
      "1": "Dear friends, there are many people who have a false message and they are going around teaching it to others. So do not trust every teacher. Instead, think carefully about what each teacher says and decide whether it came from God’s Spirit {or from a different spirit}.",
      "2": "I will tell you how to know if someone is teaching truth that comes from the Spirit of God {or if he is not}. Those who affirm that Jesus the Messiah came from God and became a human like us are teaching a message that is from God.",
      "3": "But those who do not affirm {that} Jesus {became a real human being} are not teaching a message from God. They are teachers who oppose the Messiah. You have heard that people like that will be coming {among us}. Even now they are already here.\n\n\\ts\\*\n\\p",
      "4": "As for you who are as dear to me as though you were my own children, you belong to God, and you have rejected what those people teach. You have done this because God, who enables you to do what he wants, is more powerful than the devil, who motivates everyone who does not honor God.",
      "5": "As for those people who are teaching what is false, they think and live in ways that do not honor God. That is why what they say also does not honor God, and that is why other people who do not honor God believe what they say.",
      "6": "As for us, God has sent us. Whoever lives in relationship with God believes and obeys what we teach. Whoever does not live in relationship with God does not believe or obey what we teach. That difference enables us to distinguish between people who teach true messages from God’s Spirit and people who teach false messages from the devil.\n\n\\ts\\*\n\\p",
      "7": "Dear friends, we must love each other. This is what God wants for us, and it is because he loves {us} that we can love {others}. Those who love {their fellow believers} have become God’s spiritual children and are living in relationship with him.",
      "8": "God’s character is to love {people}. So whoever does not love {others} is not living in relationship with God.\n\n\\ts\\*",
      "9": "I will tell you how God has shown us that he loves us. He sent his only Son to this earth so that his Son would enable us to live eternally because of what he did for us.",
      "10": "I will tell you what loving {someone} really means. Our efforts to love God do not define what it means to love {someone}. No, God himself did that by loving us so much that he sent his Son to offer himself as a sacrifice in our place. When Jesus did that, God could forgive the sins of people who trust in Jesus, instead of punishing them.\n\n\\ts\\*",
      "11": "Dear friends, since God loves us like that, we certainly ought to love each other!\n\\p",
      "12": "No one has ever seen God. Nevertheless, when we love each other, we can see that God lives within us and that he is the one who enables us to love others, just as he intended for us to do.",
      "13": "This is how we can be sure that we are sharing life with God and that God is sharing life with us: He has given us his own Spirit.",
      "14": "We {apostles} have seen God’s Son {Jesus on earth}, and we solemnly tell others that the Father sent him to save the people in the world {from suffering eternally for their sins}.\n\n\\ts\\*",
      "15": "So God continues to share life with those who say the truth about Jesus. They say, “He is the Son of God.” And so they continue to share life with God.",
      "16": "We have experienced how God loves us and we believe that he loves us. Because God’s nature is to love people, those who continue to love others share life with God, and God shares life with them.\n\n\\ts\\*",
      "17": "When we continue to share life with God, then God has achieved his purpose in loving us. As a result, when the time comes for God to judge us, we will be confident {that he will not condemn us}. This is because we are {loving others as we live} in this world just as Jesus does.",
      "18": "We will not be afraid {of God} if we truly love him, because those who love {God} completely cannot be afraid {of him}. We would be afraid only if we thought that he would punish us. So those who are afraid {of God} have not completely understood how much he loves them, and they are not loving {God} completely.\n\n\\ts\\*",
      "19": "We love {God and others} because God loved us first.",
      "20": "People are lying if they say that they love God but they also hate a fellow believer. After all, we can see our fellow believers. But we have not seen God. So those who do not love one of their fellow believers certainly cannot be loving God, {because it is much easier to love someone whom you can see than someone whom you cannot see}.",
      "21": "Keep in mind that this is what God has commanded us: If we love him, we must also love our fellow believers.\n\n\\ts\\*",
      "front": "\\p"
    },
    "5": {
      "1": "All those who believe that Jesus is the Messiah are spiritually children of God. Now, whoever loves anyone who is a father {certainly} loves his child also. {So if we believe in Jesus, then we love God, and therefore we should also love our fellow believers.}",
      "2": "We can be sure that we truly love others who believe that Jesus is the Messiah when we love God and do what he commands us to do.",
      "3": "I am saying this because what loving God really means is that we do what he commands us to do. And it is not difficult to do what he commands us to do.\n\n\\ts\\*",
      "4": "Here is the reason why it is not difficult for us to do what God commands. All of us who have become God’s spiritual children have been able to refuse to do what unbelievers want us to do. There is one reason why we are stronger than everything that is against God. It is because we trust in Jesus.",
      "5": "I will tell you who is stronger than everything that is against God: It is anyone who believes that Jesus is the Son of God.\n\n\\ts\\*\n\\p",
      "6": "Jesus the Messiah is the one who came {to earth from God}, experiencing both {the} water {of his baptism} and {the} blood {of his death on the cross}. God showed that he had truly sent Jesus not only {when John baptized Jesus} in water, but also when Jesus’ blood flowed from his body {when he died}. And God’s Spirit declares {truthfully that Jesus the Messiah did these things}, because the Spirit always tells the truth.",
      "7": "So there are three ways by which we know {that Jesus is the Messiah who came from God}.",
      "8": "{Those three ways are:} what God’s Spirit tells us, what happened {when John baptized Jesus} in water, and what happened when {Jesus’} blood flowed {from his body when he died on the cross}. These three things all tell us the same thing{, that Jesus came from God}.\n\n\\ts\\*",
      "9": "We rely on what people tell us when we have to decide about something. But we can certainly rely much more on what God tells us. So let me tell you what God has told us about who his Son is.",
      "10": "{First, however, let me say that} those who trust in the Son of God already know that what God says about him is true. But those who do not believe what God says are calling him a liar, because they have refused to believe what God has testified about his Son.\n\n\\ts\\*",
      "11": "Now this is what God has told us {about who his Son is}: “I gave you eternal life, and my Son is the one who makes this life possible.”",
      "12": "Those who share life with God’s Son {Jesus} have begun to live forever {with God}. Those who do not share life with God’s Son have not begun to live forever.\n\n\\ts\\*\n\\p",
      "13": "Because I want you to know that you will live forever, I have written this letter to you. This is for you who believe that Jesus is the Son of God.",
      "14": "I also want you to know that we can be very confident that God wants to do what we ask of him when we pray for what he desires.",
      "15": "Since we know that God wants to give us whatever we ask of him, {if it is what he desires,} then we also know that God is already giving us what we ask of him.\n\n\\ts\\*\n\\p",
      "16": "For example, suppose someone sees one of his fellow believers sinning in a way that would not separate him from God eternally. Then he should ask {God to restore the one who is sinning}. If he does that, then God will bring that person back into spiritual life with himself. However, I am saying this only about people who are sinning in a way that would not separate them from God eternally. There is sin that causes people to separate from God eternally. I am not saying that you should pray for people who are sinning in that way.",
      "17": "Every wrong thing that people do is a sin {against God}, but there are some sins that will not separate a person from God eternally.\n\n\\ts\\*",
      "18": "We know that everyone who has become God’s spiritual son or daughter does not continually sin. Instead, the Son of God protects that person so that Satan, that evil being, does not harm him.",
      "19": "We know that we belong to God. We also know that Satan, that evil being, is controlling all the people who are unbelievers.\n\n\\ts\\*",
      "20": "We also know that the Son of God has come among us and has made it possible for us to understand {what is true}. He did this so that we can truly know the genuine God. And we are sharing life with the genuine God, {that is,} with his Son, Jesus the Messiah. Jesus is truly God, and he is the one who gives us {this new,} eternal life.\n\\p",
      "21": "I say this to you who are as dear to me as though you were my own children: “Be careful that you never give yourselves to anything that is a false god.”",
      "front": "\\p"
    },
    "manifest": {
      "language_id": "en",
      "language_name": "English",
      "direction": "ltr",
      "resource_id": "targetLanguage",
      "description": "Target Language"
    }
  };
  const toolsSettings = {
    "ScripturePane": {
      "currentPaneSettings": [
        {
          "languageId": "targetLanguage",
          "bibleId": "targetBible",
          "fontSize": 120,
          "owner": "Door43-Catalog"
        },
        {
          "languageId": "originalLanguage",
          "bibleId": "ugnt",
          "owner": "Door43-Catalog"
        },
        {
          "languageId": "en",
          "bibleId": "ult",
          "owner": "Door43-Catalog",
          "isPreRelease": false
        },
        {
          "languageId": "fa",
          "bibleId": "glt",
          "owner": "fa_gl",
          "isPreRelease": false
        }
      ]
    }
  };
  const alignedGLText = 'eternity';
  const handleComment = () => {
    console.log(`${name}-handleComment`)
  }
  const isVerseChanged = false;
  const setToolSettings = () => {
    console.log(`${name}-setToolSettings`)
  }
  const openAlertDialog = () => {
    console.log(`${name}-openAlertDialog`)
  }
  const handleEditVerse = () => {
    console.log(`${name}-handleEditVerse`)
  }
  const maximumSelections = 4
  const isVerseInvalidated = false
  const handleTagsCheckbox = () => {
    console.log(`${name}-handleTagsCheckbox`)
  }
  const validateSelections = () => {
    console.log(`${name}-validateSelections`)
  }
  const targetLanguageFont = 'default'
  const unfilteredVerseText = 'The people who do not honor God will disappear, along with all of the things that they desire. But the people who do what God wants them to do will live forever!\n\n\\ts\\*\n\\p'
  const checkIfVerseChanged = () => {
    console.log(`${name}-checkIfVerseChanged`)
  }
  const targetLanguageDetails = {
    "id": "en",
    "name": "English",
    "direction": "ltr",
    "book": {
      "name": "1 John"
    }
  }
  const checkIfCommentChanged = () => {
    console.log(`${name}-checkIfCommentChanged`)
  }
  const changeSelectionsInLocalState = (selections) => {
    console.log(`${name}-changeSelectionsInLocalState`, selections)
    setState({
      newSelections: selections,
    });
  }
  const toggleNothingToSelect = (select) => {
    console.log(`${name}-toggleNothingToSelect`, select)
    setState({ localNothingToSelect: select })
  }
  const groupsData = {
    "age": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": [
          {
            "text": "desire",
            "occurrence": 1,
            "occurrences": 1
          }
        ],
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "age",
          "quote": "αἰῶνα",
          "strong": [
            "G01650"
          ],
          "lemma": [
            "αἰών"
          ],
          "occurrence": 1
        },
        "invalidated": false
      }
    ],
    "amazed": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "amazed",
          "quote": "θαυμάζετε",
          "strong": [
            "G22960"
          ],
          "lemma": [
            "θαυμάζω"
          ],
          "occurrence": 1
        }
      }
    ],
    "anoint": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "anoint",
          "quote": "χρῖσμα",
          "strong": [
            "G55450"
          ],
          "lemma": [
            "χρῖσμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "anoint",
          "quote": "χρῖσμα",
          "strong": [
            "G55450"
          ],
          "lemma": [
            "χρῖσμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "anoint",
          "quote": "χρῖσμα",
          "strong": [
            "G55450"
          ],
          "lemma": [
            "χρῖσμα"
          ],
          "occurrence": 2
        }
      }
    ],
    "antichrist": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "antichrist",
          "quote": "ἀντίχριστος",
          "strong": [
            "G05000"
          ],
          "lemma": [
            "ἀντίχριστος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "antichrist",
          "quote": "ἀντίχριστοι",
          "strong": [
            "G05000"
          ],
          "lemma": [
            "ἀντίχριστος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "antichrist",
          "quote": "ἀντίχριστος",
          "strong": [
            "G05000"
          ],
          "lemma": [
            "ἀντίχριστος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "antichrist",
          "quote": "ἀντιχρίστου",
          "strong": [
            "G05000"
          ],
          "lemma": [
            "ἀντίχριστος"
          ],
          "occurrence": 1
        }
      }
    ],
    "astray": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 26
          },
          "tool": "translationWords",
          "groupId": "astray",
          "quote": "πλανώντων",
          "strong": [
            "G41050"
          ],
          "lemma": [
            "πλανάω"
          ],
          "occurrence": 1
        }
      }
    ],
    "believe": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύσωμεν",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύετε",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πεπιστεύκαμεν",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύων",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύων",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύων",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύων",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πεπίστευκεν",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "believe",
          "quote": "πιστεύουσιν",
          "strong": [
            "G41000"
          ],
          "lemma": [
            "πιστεύω"
          ],
          "occurrence": 1
        }
      }
    ],
    "beloved": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "beloved",
          "quote": "ἀγαπητοί",
          "strong": [
            "G00270"
          ],
          "lemma": [
            "ἀγαπητός"
          ],
          "occurrence": 1
        }
      }
    ],
    "biblicaltimeday": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "biblicaltimeday",
          "quote": "ἡμέρᾳ",
          "strong": [
            "G22500"
          ],
          "lemma": [
            "ἡμέρα"
          ],
          "occurrence": 1
        }
      }
    ],
    "blood": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "blood",
          "quote": "αἷμα",
          "strong": [
            "G01290"
          ],
          "lemma": [
            "αἷμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "blood",
          "quote": "αἵματος",
          "strong": [
            "G01290"
          ],
          "lemma": [
            "αἷμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "blood",
          "quote": "αἵματι",
          "strong": [
            "G01290"
          ],
          "lemma": [
            "αἷμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "blood",
          "quote": "αἷμα",
          "strong": [
            "G01290"
          ],
          "lemma": [
            "αἷμα"
          ],
          "occurrence": 1
        }
      }
    ],
    "bold": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 28
          },
          "tool": "translationWords",
          "groupId": "bold",
          "quote": "παρρησίαν",
          "strong": [
            "G39540"
          ],
          "lemma": [
            "παρρησία"
          ],
          "occurrence": 1
        }
      }
    ],
    "bornagain": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 29
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγέννηται",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγεννημένος",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγέννηται",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγέννηται",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγέννηται",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεννήσαντα",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγεννημένον",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγεννημένον",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεγεννημένος",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "bornagain",
          "quote": "γεννηθεὶς",
          "strong": [
            "G10800"
          ],
          "lemma": [
            "γεννάω"
          ],
          "occurrence": 1
        }
      }
    ],
    "brother": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφοῦ",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφοί",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφούς",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφῶν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "brother",
          "quote": "ἀδελφὸν",
          "strong": [
            "G00800"
          ],
          "lemma": [
            "ἀδελφός"
          ],
          "occurrence": 1
        }
      }
    ],
    "burden": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "burden",
          "quote": "βαρεῖαι",
          "strong": [
            "G09260"
          ],
          "lemma": [
            "βαρύς"
          ],
          "occurrence": 1
        }
      }
    ],
    "cain": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "cain",
          "quote": "Κάϊν",
          "strong": [
            "G25350"
          ],
          "lemma": [
            "Κάϊν"
          ],
          "occurrence": 1
        }
      }
    ],
    "call": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "call",
          "quote": "κληθῶμεν",
          "strong": [
            "G25640"
          ],
          "lemma": [
            "καλέω"
          ],
          "occurrence": 1
        }
      }
    ],
    "children": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "παιδία",
          "strong": [
            "G38130"
          ],
          "lemma": [
            "παιδίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "παιδία",
          "strong": [
            "G38130"
          ],
          "lemma": [
            "παιδίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 28
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τέκνα",
          "strong": [
            "G50430"
          ],
          "lemma": [
            "τέκνον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τέκνα",
          "strong": [
            "G50430"
          ],
          "lemma": [
            "τέκνον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τέκνα",
          "strong": [
            "G50430"
          ],
          "lemma": [
            "τέκνον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τέκνα",
          "strong": [
            "G50430"
          ],
          "lemma": [
            "τέκνον"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τέκνα",
          "strong": [
            "G50430"
          ],
          "lemma": [
            "τέκνον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "children",
          "quote": "τεκνία",
          "strong": [
            "G50400"
          ],
          "lemma": [
            "τεκνίον"
          ],
          "occurrence": 1
        }
      }
    ],
    "christ": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστοῦ",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστὸν",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστός",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστοῦ",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστὸν",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστὸς",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστός",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "christ",
          "quote": "Χριστῷ",
          "strong": [
            "G55470"
          ],
          "lemma": [
            "χριστός"
          ],
          "occurrence": 1
        }
      }
    ],
    "clean": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "clean",
          "quote": "καθαρίζει",
          "strong": [
            "G25110"
          ],
          "lemma": [
            "καθαρίζω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "clean",
          "quote": "καθαρίσῃ",
          "strong": [
            "G25110"
          ],
          "lemma": [
            "καθαρίζω"
          ],
          "occurrence": 1
        }
      }
    ],
    "command": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴν",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴν",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴ",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴν",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴ",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴν",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὴν",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολὰς",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "command",
          "quote": "ἐντολαὶ",
          "strong": [
            "G17850"
          ],
          "lemma": [
            "ἐντολή"
          ],
          "occurrence": 1
        }
      }
    ],
    "condemn": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "condemn",
          "quote": "καταγινώσκῃ",
          "strong": [
            "G26070"
          ],
          "lemma": [
            "καταγινώσκω"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "condemn",
          "quote": "καταγινώσκῃ",
          "strong": [
            "G26070"
          ],
          "lemma": [
            "καταγινώσκω"
          ],
          "occurrence": 1
        }
      }
    ],
    "confess": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "confess",
          "quote": "ὁμολογῶμεν",
          "strong": [
            "G36700"
          ],
          "lemma": [
            "ὁμολογέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "confess",
          "quote": "ὁμολογῶν",
          "strong": [
            "G36700"
          ],
          "lemma": [
            "ὁμολογέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "confess",
          "quote": "ὁμολογεῖ",
          "strong": [
            "G36700"
          ],
          "lemma": [
            "ὁμολογέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "confess",
          "quote": "ὁμολογεῖ",
          "strong": [
            "G36700"
          ],
          "lemma": [
            "ὁμολογέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "confess",
          "quote": "ὁμολογήσῃ",
          "strong": [
            "G36700"
          ],
          "lemma": [
            "ὁμολογέω"
          ],
          "occurrence": 1
        }
      }
    ],
    "confidence": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "confidence",
          "quote": "παρρησίαν",
          "strong": [
            "G39540"
          ],
          "lemma": [
            "παρρησία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "confidence",
          "quote": "παρρησίαν",
          "strong": [
            "G39540"
          ],
          "lemma": [
            "παρρησία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "confidence",
          "quote": "παρρησία",
          "strong": [
            "G39540"
          ],
          "lemma": [
            "παρρησία"
          ],
          "occurrence": 1
        }
      }
    ],
    "darkness": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτία",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκότει",
          "strong": [
            "G46550"
          ],
          "lemma": [
            "σκότος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτία",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτίᾳ",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτίᾳ",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτίᾳ",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "darkness",
          "quote": "σκοτία",
          "strong": [
            "G46530"
          ],
          "lemma": [
            "σκοτία"
          ],
          "occurrence": 1
        }
      }
    ],
    "death": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θανάτου",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θανάτῳ",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θάνατον",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θάνατον",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θάνατον",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 3
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "death",
          "quote": "θάνατον",
          "strong": [
            "G22880"
          ],
          "lemma": [
            "θάνατος"
          ],
          "occurrence": 1
        }
      }
    ],
    "deceive": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "deceive",
          "quote": "πλανῶμεν",
          "strong": [
            "G41050"
          ],
          "lemma": [
            "πλανάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "deceive",
          "quote": "πλανάτω",
          "strong": [
            "G41050"
          ],
          "lemma": [
            "πλανάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "deceive",
          "quote": "πλάνης",
          "strong": [
            "G41060"
          ],
          "lemma": [
            "πλάνη"
          ],
          "occurrence": 1
        }
      }
    ],
    "declare": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "declare",
          "quote": "ἀπαγγέλλομεν",
          "strong": [
            "G05180"
          ],
          "lemma": [
            "ἀπαγγέλλω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "declare",
          "quote": "ἀπαγγέλλομεν",
          "strong": [
            "G05180"
          ],
          "lemma": [
            "ἀπαγγέλλω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "declare",
          "quote": "ἀναγγέλλομεν",
          "strong": [
            "G03120"
          ],
          "lemma": [
            "ἀναγγέλλω"
          ],
          "occurrence": 1
        }
      }
    ],
    "eternity": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιον",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 25
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιον",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιον",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιον",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιον",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "eternity",
          "quote": "αἰώνιος",
          "strong": [
            "G01660"
          ],
          "lemma": [
            "αἰώνιος"
          ],
          "occurrence": 1
        }
      }
    ],
    "evil": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "evil",
          "quote": "πονηρὰ",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      }
    ],
    "faith": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "faith",
          "quote": "πίστις",
          "strong": [
            "G41020"
          ],
          "lemma": [
            "πίστις"
          ],
          "occurrence": 1
        }
      }
    ],
    "faithful": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "faithful",
          "quote": "πιστός",
          "strong": [
            "G41030"
          ],
          "lemma": [
            "πιστός"
          ],
          "occurrence": 1
        }
      }
    ],
    "falsegod": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "falsegod",
          "quote": "εἰδώλων",
          "strong": [
            "G14970"
          ],
          "lemma": [
            "εἴδωλον"
          ],
          "occurrence": 1
        }
      }
    ],
    "falseprophet": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "falseprophet",
          "quote": "ψευδοπροφῆται",
          "strong": [
            "G55780"
          ],
          "lemma": [
            "ψευδοπροφήτης"
          ],
          "occurrence": 1
        }
      }
    ],
    "father": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "father",
          "quote": "πατέρες",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      }
    ],
    "fear": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "fear",
          "quote": "φόβος",
          "strong": [
            "G54010"
          ],
          "lemma": [
            "φόβος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "fear",
          "quote": "φόβον",
          "strong": [
            "G54010"
          ],
          "lemma": [
            "φόβος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "fear",
          "quote": "φόβος",
          "strong": [
            "G54010"
          ],
          "lemma": [
            "φόβος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "fear",
          "quote": "φοβούμενος",
          "strong": [
            "G53990"
          ],
          "lemma": [
            "φοβέω"
          ],
          "occurrence": 1
        }
      }
    ],
    "fellowship": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "fellowship",
          "quote": "κοινωνίαν",
          "strong": [
            "G28420"
          ],
          "lemma": [
            "κοινωνία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "fellowship",
          "quote": "κοινωνία",
          "strong": [
            "G28420"
          ],
          "lemma": [
            "κοινωνία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "fellowship",
          "quote": "κοινωνίαν",
          "strong": [
            "G28420"
          ],
          "lemma": [
            "κοινωνία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "fellowship",
          "quote": "κοινωνίαν",
          "strong": [
            "G28420"
          ],
          "lemma": [
            "κοινωνία"
          ],
          "occurrence": 1
        }
      }
    ],
    "flesh": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "flesh",
          "quote": "σαρκὸς",
          "strong": [
            "G45610"
          ],
          "lemma": [
            "σάρξ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "flesh",
          "quote": "σαρκὶ",
          "strong": [
            "G45610"
          ],
          "lemma": [
            "σάρξ"
          ],
          "occurrence": 1
        }
      }
    ],
    "forgive": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "forgive",
          "quote": "ἀφῇ",
          "strong": [
            "G08630"
          ],
          "lemma": [
            "ἀφίημι"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "forgive",
          "quote": "ἀφέωνται",
          "strong": [
            "G08630"
          ],
          "lemma": [
            "ἀφίημι"
          ],
          "occurrence": 1
        }
      }
    ],
    "god": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεόν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεόν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεόν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεόν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεῷ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεῷ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 3
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεόν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸν",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεῷ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεοῦ",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "god",
          "quote": "Θεὸς",
          "strong": [
            "G23160"
          ],
          "lemma": [
            "θεός"
          ],
          "occurrence": 1
        }
      }
    ],
    "godthefather": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατρὸς",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατρὸς",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατρός",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατέρα",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατρὶ",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατὴρ",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "godthefather",
          "quote": "Πατὴρ",
          "strong": [
            "G39620"
          ],
          "lemma": [
            "πατήρ"
          ],
          "occurrence": 1
        }
      }
    ],
    "hand": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "hand",
          "quote": "χεῖρες",
          "strong": [
            "G54950"
          ],
          "lemma": [
            "χείρ"
          ],
          "occurrence": 1
        }
      }
    ],
    "heart": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "heart",
          "quote": "καρδίας",
          "strong": [
            "G25880"
          ],
          "lemma": [
            "καρδία"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "heart",
          "quote": "καρδία",
          "strong": [
            "G25880"
          ],
          "lemma": [
            "καρδία"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "heart",
          "quote": "καρδίας",
          "strong": [
            "G25880"
          ],
          "lemma": [
            "καρδία"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "heart",
          "quote": "καρδία",
          "strong": [
            "G25880"
          ],
          "lemma": [
            "καρδία"
          ],
          "occurrence": 1
        }
      }
    ],
    "holyone": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "holyone",
          "quote": "Ἁγίου",
          "strong": [
            "G00400"
          ],
          "lemma": [
            "ἅγιος"
          ],
          "occurrence": 1
        }
      }
    ],
    "holyspirit": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεύματος",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεύματος",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεῦμά",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεῦμά",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "holyspirit",
          "quote": "Πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      }
    ],
    "hope": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "hope",
          "quote": "ἐλπίδα",
          "strong": [
            "G16800"
          ],
          "lemma": [
            "ἐλπίς"
          ],
          "occurrence": 1
        }
      }
    ],
    "hour": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "hour",
          "quote": "ὥρα",
          "strong": [
            "G56100"
          ],
          "lemma": [
            "ὥρα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "hour",
          "quote": "ὥρα",
          "strong": [
            "G56100"
          ],
          "lemma": [
            "ὥρα"
          ],
          "occurrence": 2
        }
      }
    ],
    "jesus": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦ",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦ",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦν",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦς",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦ",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦν",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦν",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦς",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦς",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦς",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦς",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "jesus",
          "quote": "Ἰησοῦ",
          "strong": [
            "G24240"
          ],
          "lemma": [
            "Ἰησοῦς"
          ],
          "occurrence": 1
        }
      }
    ],
    "joy": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "joy",
          "quote": "χαρὰ",
          "strong": [
            "G54790"
          ],
          "lemma": [
            "χαρά"
          ],
          "occurrence": 1
        }
      }
    ],
    "judge": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "judge",
          "quote": "κρίσεως",
          "strong": [
            "G29200"
          ],
          "lemma": [
            "κρίσις"
          ],
          "occurrence": 1
        }
      }
    ],
    "know": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκαμεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἔγνωκα",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἶδεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκατε",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκατε",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκατε",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδατε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδατε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδατε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 29
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "εἰδῆτε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "εἴδω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 29
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκετε",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκει",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἔγνω",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδατε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἔγνωκεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδατε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκαμεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γνωσόμεθα",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκει",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκετε",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκων",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκει",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἔγνω",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "ἐγνώκαμεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκομεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "εἰδῆτε",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "εἴδω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "οἴδαμεν",
          "strong": [
            "G14920"
          ],
          "lemma": [
            "οἶδα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "know",
          "quote": "γινώσκωμεν",
          "strong": [
            "G10970"
          ],
          "lemma": [
            "γινώσκω"
          ],
          "occurrence": 1
        }
      }
    ],
    "lawful": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "lawful",
          "quote": "ἀνομίαν",
          "strong": [
            "G04580"
          ],
          "lemma": [
            "ἀνομία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "lawful",
          "quote": "ἀνομία",
          "strong": [
            "G04580"
          ],
          "lemma": [
            "ἀνομία"
          ],
          "occurrence": 1
        }
      }
    ],
    "life": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωῆς",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴ",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "βίου",
          "strong": [
            "G09790"
          ],
          "lemma": [
            "βίος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 25
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωήν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ψυχὴν",
          "strong": [
            "G55900"
          ],
          "lemma": [
            "ψυχή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ψυχὰς",
          "strong": [
            "G55900"
          ],
          "lemma": [
            "ψυχή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζήσωμεν",
          "strong": [
            "G21980"
          ],
          "lemma": [
            "ζάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴ",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωήν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωήν",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "life",
          "quote": "ζωὴ",
          "strong": [
            "G22220"
          ],
          "lemma": [
            "ζωή"
          ],
          "occurrence": 1
        }
      }
    ],
    "light": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φῶς",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φωτὶ",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φωτί",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φῶς",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φωτὶ",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "light",
          "quote": "φωτὶ",
          "strong": [
            "G54570"
          ],
          "lemma": [
            "φῶς"
          ],
          "occurrence": 1
        }
      }
    ],
    "like": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "ὡς",
          "strong": [
            "G56130"
          ],
          "lemma": [
            "ὡς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "ὡς",
          "strong": [
            "G56130"
          ],
          "lemma": [
            "ὡς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "ὅμοιοι",
          "strong": [
            "G36640"
          ],
          "lemma": [
            "ὅμοιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθώς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "like",
          "quote": "καθὼς",
          "strong": [
            "G25310"
          ],
          "lemma": [
            "καθώς"
          ],
          "occurrence": 1
        }
      }
    ],
    "love": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾶτε",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾷ",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπην",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπην",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἠγαπήκαμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἠγάπησεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἠγάπησεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπην",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπῃ",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπῃ",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπῃ",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἠγάπησεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶ",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾷ",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπᾷ",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγαπῶμεν",
          "strong": [
            "G00250"
          ],
          "lemma": [
            "ἀγαπάω"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "love",
          "quote": "ἀγάπη",
          "strong": [
            "G00260"
          ],
          "lemma": [
            "ἀγάπη"
          ],
          "occurrence": 1
        }
      }
    ],
    "lust": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "lust",
          "quote": "ἐπιθυμία",
          "strong": [
            "G19390"
          ],
          "lemma": [
            "ἐπιθυμία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "lust",
          "quote": "ἐπιθυμία",
          "strong": [
            "G19390"
          ],
          "lemma": [
            "ἐπιθυμία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "lust",
          "quote": "ἐπιθυμία",
          "strong": [
            "G19390"
          ],
          "lemma": [
            "ἐπιθυμία"
          ],
          "occurrence": 1
        }
      }
    ],
    "name": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "name",
          "quote": "ὄνομα",
          "strong": [
            "G36860"
          ],
          "lemma": [
            "ὄνομα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "name",
          "quote": "ὀνόματι",
          "strong": [
            "G36860"
          ],
          "lemma": [
            "ὄνομα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "name",
          "quote": "ὄνομα",
          "strong": [
            "G36860"
          ],
          "lemma": [
            "ὄνομα"
          ],
          "occurrence": 1
        }
      }
    ],
    "obey": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῶμεν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῶν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῇ",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηροῦμεν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῶν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῶμεν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "obey",
          "quote": "τηρῶμεν",
          "strong": [
            "G50830"
          ],
          "lemma": [
            "τηρέω"
          ],
          "occurrence": 1
        }
      }
    ],
    "perfect": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "perfect",
          "quote": "τετελείωται",
          "strong": [
            "G50480"
          ],
          "lemma": [
            "τελειόω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "perfect",
          "quote": "τετελειωμένη",
          "strong": [
            "G50480"
          ],
          "lemma": [
            "τελειόω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "perfect",
          "quote": "τετελείωται",
          "strong": [
            "G50480"
          ],
          "lemma": [
            "τελειόω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "perfect",
          "quote": "τελεία",
          "strong": [
            "G50460"
          ],
          "lemma": [
            "τέλειος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "perfect",
          "quote": "τετελείωται",
          "strong": [
            "G50480"
          ],
          "lemma": [
            "τελειόω"
          ],
          "occurrence": 1
        }
      }
    ],
    "pray": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "pray",
          "quote": "ἐρωτήσῃ",
          "strong": [
            "G20650"
          ],
          "lemma": [
            "ἐρωτάω"
          ],
          "occurrence": 1
        }
      }
    ],
    "promise": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 25
          },
          "tool": "translationWords",
          "groupId": "promise",
          "quote": "ἐπαγγελία",
          "strong": [
            "G18600"
          ],
          "lemma": [
            "ἐπαγγελία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 25
          },
          "tool": "translationWords",
          "groupId": "promise",
          "quote": "ἐπηγγείλατο",
          "strong": [
            "G18610"
          ],
          "lemma": [
            "ἐπαγγέλλω"
          ],
          "occurrence": 1
        }
      }
    ],
    "propitiation": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "propitiation",
          "quote": "ἱλασμός",
          "strong": [
            "G24340"
          ],
          "lemma": [
            "ἱλασμός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "propitiation",
          "quote": "ἱλασμὸν",
          "strong": [
            "G24340"
          ],
          "lemma": [
            "ἱλασμός"
          ],
          "occurrence": 1
        }
      }
    ],
    "punish": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "punish",
          "quote": "κόλασιν",
          "strong": [
            "G28510"
          ],
          "lemma": [
            "κόλασις"
          ],
          "occurrence": 1
        }
      }
    ],
    "purify": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "purify",
          "quote": "ἁγνίζει",
          "strong": [
            "G00480"
          ],
          "lemma": [
            "ἁγνίζω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "purify",
          "quote": "ἁγνός",
          "strong": [
            "G00530"
          ],
          "lemma": [
            "ἁγνός"
          ],
          "occurrence": 1
        }
      }
    ],
    "receive": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "receive",
          "quote": "ἐλάβετε",
          "strong": [
            "G29830"
          ],
          "lemma": [
            "λαμβάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "receive",
          "quote": "λαμβάνομεν",
          "strong": [
            "G29830"
          ],
          "lemma": [
            "λαμβάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "receive",
          "quote": "λαμβάνομεν",
          "strong": [
            "G29830"
          ],
          "lemma": [
            "λαμβάνω"
          ],
          "occurrence": 1
        }
      }
    ],
    "reveal": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "reveal",
          "quote": "φανερωθῶσιν",
          "strong": [
            "G53190"
          ],
          "lemma": [
            "φανερόω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "reveal",
          "quote": "ἐφανερώθη",
          "strong": [
            "G53190"
          ],
          "lemma": [
            "φανερόω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "reveal",
          "quote": "φανερά",
          "strong": [
            "G53180"
          ],
          "lemma": [
            "φανερός"
          ],
          "occurrence": 1
        }
      }
    ],
    "righteous": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαιος",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "ἀδικίας",
          "strong": [
            "G00930"
          ],
          "lemma": [
            "ἀδικία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαιον",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 29
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαιός",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 29
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δικαιοσύνην",
          "strong": [
            "G13430"
          ],
          "lemma": [
            "δικαιοσύνη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δικαιοσύνην",
          "strong": [
            "G13430"
          ],
          "lemma": [
            "δικαιοσύνη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαιός",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαιός",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δικαιοσύνην",
          "strong": [
            "G13430"
          ],
          "lemma": [
            "δικαιοσύνη"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "δίκαια",
          "strong": [
            "G13420"
          ],
          "lemma": [
            "δίκαιος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "righteous",
          "quote": "ἀδικία",
          "strong": [
            "G00930"
          ],
          "lemma": [
            "ἀδικία"
          ],
          "occurrence": 1
        }
      }
    ],
    "satan": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "πονηρόν",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "πονηρόν",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "διαβόλου",
          "strong": [
            "G12280"
          ],
          "lemma": [
            "διάβολος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "διάβολος",
          "strong": [
            "G12280"
          ],
          "lemma": [
            "διάβολος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "διαβόλου",
          "strong": [
            "G12280"
          ],
          "lemma": [
            "διάβολος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "διαβόλου",
          "strong": [
            "G12280"
          ],
          "lemma": [
            "διάβολος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "πονηροῦ",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "πονηρὸς",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "satan",
          "quote": "πονηρῷ",
          "strong": [
            "G41900"
          ],
          "lemma": [
            "πονηρός"
          ],
          "occurrence": 1
        }
      }
    ],
    "savior": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "savior",
          "quote": "Σωτῆρα",
          "strong": [
            "G49900"
          ],
          "lemma": [
            "σωτήρ"
          ],
          "occurrence": 1
        }
      }
    ],
    "seed": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "seed",
          "quote": "σπέρμα",
          "strong": [
            "G46900"
          ],
          "lemma": [
            "σπέρμα"
          ],
          "occurrence": 1
        }
      }
    ],
    "send": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "send",
          "quote": "ἀπέσταλκεν",
          "strong": [
            "G06490"
          ],
          "lemma": [
            "ἀποστέλλω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "send",
          "quote": "ἀπέστειλεν",
          "strong": [
            "G06490"
          ],
          "lemma": [
            "ἀποστέλλω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "send",
          "quote": "ἀπέσταλκεν",
          "strong": [
            "G06490"
          ],
          "lemma": [
            "ἀποστέλλω"
          ],
          "occurrence": 1
        }
      }
    ],
    "shame": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 28
          },
          "tool": "translationWords",
          "groupId": "shame",
          "quote": "αἰσχυνθῶμεν",
          "strong": [
            "G01530"
          ],
          "lemma": [
            "αἰσχύνω"
          ],
          "occurrence": 1
        }
      }
    ],
    "sin": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίας",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίας",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίας",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἡμαρτήκαμεν",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμάρτητε",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμάρτῃ",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτιῶν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαι",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτία",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίας",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτία",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνει",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνων",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνει",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνειν",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτιῶν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνοντα",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτίαν",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνουσιν",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτία",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτία",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτία",
          "strong": [
            "G02660"
          ],
          "lemma": [
            "ἁμαρτία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "sin",
          "quote": "ἁμαρτάνει",
          "strong": [
            "G02640"
          ],
          "lemma": [
            "ἁμαρτάνω"
          ],
          "occurrence": 1
        }
      }
    ],
    "sonofgod": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱοῦ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱοῦ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 22
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱόν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 24
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱῷ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸς",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 2
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 23
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱοῦ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸς",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸς",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱοῦ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸν",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱοῦ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱῷ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱὸν",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸν",
              "occurrence": 2
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱοῦ",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 2
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": [
            {
              "word": "Υἱὸς",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G52070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "υἱός",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "sonofgod",
          "quote": "Υἱῷ",
          "strong": [
            "G52070"
          ],
          "lemma": [
            "υἱός"
          ],
          "occurrence": 1
        }
      }
    ],
    "spirit": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεύματι",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεύματα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "spirit",
          "quote": "πνεῦμα",
          "strong": [
            "G41510"
          ],
          "lemma": [
            "πνεῦμα"
          ],
          "occurrence": 2
        }
      }
    ],
    "strength": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "strength",
          "quote": "ἰσχυροί",
          "strong": [
            "G24780"
          ],
          "lemma": [
            "ἰσχυρός"
          ],
          "occurrence": 1
        }
      }
    ],
    "stumblingblock": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "stumblingblock",
          "quote": "σκάνδαλον",
          "strong": [
            "G46250"
          ],
          "lemma": [
            "σκάνδαλον"
          ],
          "occurrence": 1
        }
      }
    ],
    "teach": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "teach",
          "quote": "διδάσκῃ",
          "strong": [
            "G13210"
          ],
          "lemma": [
            "διδάσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "teach",
          "quote": "διδάσκει",
          "strong": [
            "G13210"
          ],
          "lemma": [
            "διδάσκω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "teach",
          "quote": "ἐδίδαξεν",
          "strong": [
            "G13210"
          ],
          "lemma": [
            "διδάσκω"
          ],
          "occurrence": 1
        }
      }
    ],
    "test": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "test",
          "quote": "δοκιμάζετε",
          "strong": [
            "G13810"
          ],
          "lemma": [
            "δοκιμάζω"
          ],
          "occurrence": 1
        }
      }
    ],
    "testimony": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυροῦμεν",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυροῦμεν",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυροῦν",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυροῦντες",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρίαν",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρία",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρία",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μεμαρτύρηκεν",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρίαν",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρίαν",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 10
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μεμαρτύρηκεν",
          "strong": [
            "G31400"
          ],
          "lemma": [
            "μαρτυρέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "testimony",
          "quote": "μαρτυρία",
          "strong": [
            "G31410"
          ],
          "lemma": [
            "μαρτυρία"
          ],
          "occurrence": 1
        }
      }
    ],
    "tongue": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "tongue",
          "quote": "γλώσσῃ",
          "strong": [
            "G11000"
          ],
          "lemma": [
            "γλῶσσα"
          ],
          "occurrence": 1
        }
      }
    ],
    "true": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀλήθειαν",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀλήθεια",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀλήθεια",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθῶς",
          "strong": [
            "G02300"
          ],
          "lemma": [
            "ἀληθῶς"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθὲς",
          "strong": [
            "G02270"
          ],
          "lemma": [
            "ἀληθής"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθινὸν",
          "strong": [
            "G02280"
          ],
          "lemma": [
            "ἀληθινός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀλήθειαν",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 21
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθείας",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 27
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθές",
          "strong": [
            "G02270"
          ],
          "lemma": [
            "ἀληθής"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθείᾳ",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθείας",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1,
          "verseSpan": "19-20"
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθείας",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀλήθεια",
          "strong": [
            "G02250"
          ],
          "lemma": [
            "ἀλήθεια"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "Ἀληθινόν",
          "strong": [
            "G02280"
          ],
          "lemma": [
            "ἀληθινός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "Ἀληθινῷ",
          "strong": [
            "G02280"
          ],
          "lemma": [
            "ἀληθινός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "true",
          "quote": "ἀληθινὸς",
          "strong": [
            "G02280"
          ],
          "lemma": [
            "ἀληθινός"
          ],
          "occurrence": 1
        }
      }
    ],
    "understand": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 20
          },
          "tool": "translationWords",
          "groupId": "understand",
          "quote": "διάνοιαν",
          "strong": [
            "G12710"
          ],
          "lemma": [
            "διάνοια"
          ],
          "occurrence": 1
        }
      }
    ],
    "walk": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "walk",
          "quote": "περιπατῶμεν",
          "strong": [
            "G40430"
          ],
          "lemma": [
            "περιπατέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 1,
            "verse": 7
          },
          "tool": "translationWords",
          "groupId": "walk",
          "quote": "περιπατῶμεν",
          "strong": [
            "G40430"
          ],
          "lemma": [
            "περιπατέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "walk",
          "quote": "περιεπάτησεν",
          "strong": [
            "G40430"
          ],
          "lemma": [
            "περιπατέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "walk",
          "quote": "περιπατεῖν",
          "strong": [
            "G40430"
          ],
          "lemma": [
            "περιπατέω"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 11
          },
          "tool": "translationWords",
          "groupId": "walk",
          "quote": "περιπατεῖ",
          "strong": [
            "G40430"
          ],
          "lemma": [
            "περιπατέω"
          ],
          "occurrence": 1
        }
      }
    ],
    "water": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "water",
          "quote": "ὕδατος",
          "strong": [
            "G52040"
          ],
          "lemma": [
            "ὕδωρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "water",
          "quote": "ὕδατι",
          "strong": [
            "G52040"
          ],
          "lemma": [
            "ὕδωρ"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 6
          },
          "tool": "translationWords",
          "groupId": "water",
          "quote": "ὕδατι",
          "strong": [
            "G52040"
          ],
          "lemma": [
            "ὕδωρ"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "water",
          "quote": "ὕδωρ",
          "strong": [
            "G52040"
          ],
          "lemma": [
            "ὕδωρ"
          ],
          "occurrence": 1
        }
      }
    ],
    "willofgod": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "willofgod",
          "quote": [
            {
              "word": "θέλημα",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G23070",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "θέλημα",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "willofgod",
          "quote": [
            {
              "word": "θέλημα",
              "occurrence": 1
            },
            {
              "word": "αὐτοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G23070",
            "G08460"
          ],
          "lemma": [
            "θέλημα",
            "αὐτός"
          ],
          "occurrence": 1
        }
      }
    ],
    "wordofgod": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "wordofgod",
          "quote": [
            {
              "word": "λόγος",
              "occurrence": 1
            },
            {
              "word": "τοῦ",
              "occurrence": 1
            },
            {
              "word": "Θεοῦ",
              "occurrence": 1
            }
          ],
          "strong": [
            "G30560",
            "G35880",
            "G23160"
          ],
          "lemma": [
            "λόγος",
            "ὁ",
            "θεός"
          ],
          "occurrence": 1
        }
      }
    ],
    "works": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 8
          },
          "tool": "translationWords",
          "groupId": "works",
          "quote": "ἔργα",
          "strong": [
            "G20410"
          ],
          "lemma": [
            "ἔργον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 12
          },
          "tool": "translationWords",
          "groupId": "works",
          "quote": "ἔργα",
          "strong": [
            "G20410"
          ],
          "lemma": [
            "ἔργον"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 18
          },
          "tool": "translationWords",
          "groupId": "works",
          "quote": "ἔργῳ",
          "strong": [
            "G20410"
          ],
          "lemma": [
            "ἔργον"
          ],
          "occurrence": 1
        }
      }
    ],
    "world": [
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 2
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμῳ",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 15
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμῳ",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 16
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 2,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμος",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμος",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 13
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμος",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 3,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 1
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 3
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμῳ",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμῳ",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμος",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 9
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 14
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμου",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 4,
            "verse": 17
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμῳ",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 4
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 2
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 5
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμον",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      },
      {
        "priority": 1,
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "nothingToSelect": false,
        "contextId": {
          "reference": {
            "bookId": "1jn",
            "chapter": 5,
            "verse": 19
          },
          "tool": "translationWords",
          "groupId": "world",
          "quote": "κόσμος",
          "strong": [
            "G28890"
          ],
          "lemma": [
            "κόσμος"
          ],
          "occurrence": 1
        }
      }
    ]
  }
  const groupsIndex = [
    {
      "id": "age",
      "name": "age, aged"
    },
    {
      "id": "amazed",
      "name": "amazed, amazement, astonished, marvel, marveled, marvelous, wonder, dumbfounded"
    },
    {
      "id": "father",
      "name": "ancestor, father, fathered, forefather, grandfather"
    },
    {
      "id": "anoint",
      "name": "anoint, anointed, anointing"
    },
    {
      "id": "antichrist",
      "name": "antichrist"
    },
    {
      "id": "astray",
      "name": "astray, go astray, went astray, lead astray, stray"
    },
    {
      "id": "believe",
      "name": "believe, believer, belief, unbeliever, unbelief"
    },
    {
      "id": "beloved",
      "name": "beloved"
    },
    {
      "id": "blood",
      "name": "blood"
    },
    {
      "id": "bold",
      "name": "bold, boldness, emboldened"
    },
    {
      "id": "bornagain",
      "name": "born again, born of God, new birth"
    },
    {
      "id": "brother",
      "name": "brother"
    },
    {
      "id": "burden",
      "name": "burden, load, heavy, hard work, hard labor, utterances"
    },
    {
      "id": "cain",
      "name": "Cain"
    },
    {
      "id": "call",
      "name": "call, call out"
    },
    {
      "id": "children",
      "name": "children, child, offspring"
    },
    {
      "id": "christ",
      "name": "Christ, Messiah"
    },
    {
      "id": "clean",
      "name": "clean, wash"
    },
    {
      "id": "command",
      "name": "command, commandment"
    },
    {
      "id": "condemn",
      "name": "condemn, condemned, condemnation"
    },
    {
      "id": "confess",
      "name": "confess, confession"
    },
    {
      "id": "confidence",
      "name": "confidence, confident"
    },
    {
      "id": "darkness",
      "name": "darkness"
    },
    {
      "id": "biblicaltimeday",
      "name": "day"
    },
    {
      "id": "deceive",
      "name": "deceive, lie, deception, illusions"
    },
    {
      "id": "declare",
      "name": "declare, proclaim, announce"
    },
    {
      "id": "death",
      "name": "die, dead, deadly, death"
    },
    {
      "id": "eternity",
      "name": "eternity, everlasting, eternal, forever"
    },
    {
      "id": "evil",
      "name": "evil, wicked, unpleasant"
    },
    {
      "id": "faith",
      "name": "faith"
    },
    {
      "id": "faithful",
      "name": "faithful, faithfulness, trustworthy"
    },
    {
      "id": "falseprophet",
      "name": "false prophet"
    },
    {
      "id": "fear",
      "name": "fear, afraid, frighten"
    },
    {
      "id": "fellowship",
      "name": "fellowship"
    },
    {
      "id": "flesh",
      "name": "flesh"
    },
    {
      "id": "forgive",
      "name": "forgive, forgiven, forgiveness, pardon, pardoned"
    },
    {
      "id": "god",
      "name": "God"
    },
    {
      "id": "godthefather",
      "name": "God the Father, heavenly Father, Father"
    },
    {
      "id": "falsegod",
      "name": "god, false god, goddess, idol, idolater, idolatrous, idolatry"
    },
    {
      "id": "hand",
      "name": "hand"
    },
    {
      "id": "heart",
      "name": "heart"
    },
    {
      "id": "holyone",
      "name": "Holy One"
    },
    {
      "id": "holyspirit",
      "name": "Holy Spirit, Spirit of God, Spirit of the Lord, Spirit"
    },
    {
      "id": "hope",
      "name": "hope, hoped"
    },
    {
      "id": "hour",
      "name": "hour"
    },
    {
      "id": "jesus",
      "name": "Jesus, Jesus Christ, Christ Jesus"
    },
    {
      "id": "joy",
      "name": "joy, joyful, rejoice, glad"
    },
    {
      "id": "judge",
      "name": "judge, judgment"
    },
    {
      "id": "know",
      "name": "know, knowledge, unknown, distinguish"
    },
    {
      "id": "lawful",
      "name": "lawful, unlawful, not lawful, lawless, lawlessness"
    },
    {
      "id": "life",
      "name": "life, live, living, alive"
    },
    {
      "id": "light",
      "name": "light, luminary, shine, brighten, enlighten"
    },
    {
      "id": "like",
      "name": "like, likeminded, likeness, likewise, alike, unlike, as if"
    },
    {
      "id": "love",
      "name": "love, beloved"
    },
    {
      "id": "lust",
      "name": "lust, lustful, passions, desires"
    },
    {
      "id": "name",
      "name": "name"
    },
    {
      "id": "obey",
      "name": "obey, keep"
    },
    {
      "id": "perfect",
      "name": "perfect, complete"
    },
    {
      "id": "pray",
      "name": "pray, prayer"
    },
    {
      "id": "promise",
      "name": "promise, promised"
    },
    {
      "id": "propitiation",
      "name": "propitiation"
    },
    {
      "id": "punish",
      "name": "punish, punished, punishment, unpunished"
    },
    {
      "id": "purify",
      "name": "pure, purify, purification"
    },
    {
      "id": "receive",
      "name": "receive, welcome, taken up, acceptance"
    },
    {
      "id": "reveal",
      "name": "reveal, revealed, revelation"
    },
    {
      "id": "righteous",
      "name": "righteous, righteousness, unrighteous, unrighteousness, upright, uprightness"
    },
    {
      "id": "satan",
      "name": "Satan, devil, evil one"
    },
    {
      "id": "savior",
      "name": "Savior, savior"
    },
    {
      "id": "seed",
      "name": "seed, semen"
    },
    {
      "id": "send",
      "name": "send, sent, send out"
    },
    {
      "id": "shame",
      "name": "shame, ashamed, disgrace, humiliate, reproach"
    },
    {
      "id": "sin",
      "name": "sin, sinful, sinner, sinning"
    },
    {
      "id": "sonofgod",
      "name": "Son of God, the Son"
    },
    {
      "id": "spirit",
      "name": "spirit, wind, breath"
    },
    {
      "id": "strength",
      "name": "strength, strengthen, strong"
    },
    {
      "id": "stumblingblock",
      "name": "stumbling block, stone of stumbling"
    },
    {
      "id": "teach",
      "name": "teach, teaching, untaught"
    },
    {
      "id": "test",
      "name": "test, tested, testing, testing in the fire"
    },
    {
      "id": "testimony",
      "name": "testimony, testify, witness, eyewitness, evidence"
    },
    {
      "id": "tongue",
      "name": "tongue, language"
    },
    {
      "id": "true",
      "name": "true, truth"
    },
    {
      "id": "understand",
      "name": "understand, understanding, thinking"
    },
    {
      "id": "walk",
      "name": "walk, walked"
    },
    {
      "id": "water",
      "name": "water, deep"
    },
    {
      "id": "willofgod",
      "name": "will of God"
    },
    {
      "id": "wordofgod",
      "name": "word of God, word of Yahweh, word of the Lord, word of truth, scripture"
    },
    {
      "id": "works",
      "name": "work, works, deeds"
    },
    {
      "id": "world",
      "name": "world, worldly"
    }
  ]
  const bookName = '1 John'
  const changeCurrentContextId = (newContext) => {
    console.log(`${name}-changeCurrentContextId`, newContext)
  }
  const direction = 'ltr'

  const isCommentChanged = false
  const bookmarkEnabled = false
  const saveSelection = () => {
    console.log(`${name}-saveSelection`)
    //TODO: save changes
    setState({ mode: 'default' });
  }
  const cancelSelection = () => {
    console.log(`${name}-cancelSelection`)
    setState({
      newSelections: selections,
      mode: 'default'
    });
  }
  const clearSelection = () => {
    console.log(`${name}-clearSelection`)
    setState({ newSelections: [] });
  }
  const toggleBookmark = () => {
    console.log(`${name}-toggleBookmark`)
  }
  const changeMode = (mode) => {
    console.log(`${name}-changeMode`, mode)
    setState({ mode })
  }
  const cancelEditVerse = () => {
    console.log(`${name}-cancelEditVerse`)
  }
  const saveEditVerse = () => {
    console.log(`${name}-saveEditVerse`)
  }
  const cancelComment = () => {
    console.log(`${name}-cancelComment`)
  }
  const saveComment = () => {
    console.log(`${name}-saveComment`)
  }

  return (
    <div style={styles.containerDiv}>
      <GroupMenuComponent
        bookName={bookName}
        translate={translate}
        contextId={contextId}
        groupsData={groupsData}
        groupsIndex={groupsIndex}
        targetLanguageFont={targetLanguageFont}
        changeCurrentContextId={changeCurrentContextId}
        direction={direction}
      />
      <div style={styles.centerDiv}>
        <CheckArea
          mode={mode}
          tags={tags}
          verseText={verseText}
          comment={commentText}
          translate={translate}
          contextId={contextId}
          selections={selections}
          bookDetails={bookDetails}
          targetBible={targetBible}
          toolsSettings={toolsSettings}
          newSelections={newSelections}
          alignedGLText={alignedGLText}
          handleComment={handleComment}
          isVerseChanged={isVerseChanged}
          invalidated={isVerseInvalidated}
          setToolSettings={setToolSettings}
          nothingToSelect={nothingToSelect}
          openAlertDialog={openAlertDialog}
          handleEditVerse={handleEditVerse}
          maximumSelections={maximumSelections}
          handleTagsCheckbox={handleTagsCheckbox}
          validateSelections={validateSelections}
          targetLanguageFont={targetLanguageFont}
          unfilteredVerseText={unfilteredVerseText}
          checkIfVerseChanged={checkIfVerseChanged}
          targetLanguageDetails={targetLanguageDetails}
          checkIfCommentChanged={checkIfCommentChanged}
          changeSelectionsInLocalState={changeSelectionsInLocalState}
        />
        <ActionsArea
          mode={mode}
          tags={tags}
          toggleNothingToSelect={toggleNothingToSelect}
          localNothingToSelect={localNothingToSelect}
          nothingToSelect={nothingToSelect}
          isCommentChanged={isCommentChanged}
          selections={selections}
          newSelections={newSelections}
          translate={translate}
          bookmarkEnabled={bookmarkEnabled}
          saveSelection={saveSelection}
          cancelSelection={cancelSelection}
          clearSelection={clearSelection}
          toggleBookmark={toggleBookmark}
          changeMode={changeMode}
          cancelEditVerse={cancelEditVerse}
          saveEditVerse={saveEditVerse}
          cancelComment={cancelComment}
          saveComment={saveComment}
        />
      </div>
    </div>
  );
};

Checker.propTypes = {
  translate: PropTypes.func.isRequired,
};
export default Checker;
