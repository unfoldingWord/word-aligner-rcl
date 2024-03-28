import React from 'react';
import PropTypes from 'prop-types';
import CheckArea from '../tc_ui_toolkit/VerseCheck/CheckArea'
import ActionsArea from '../tc_ui_toolkit/VerseCheck/ActionsArea'
import VerseCheck from '../tc_ui_toolkit/VerseCheck'

// const tc = require('../__tests__/fixtures/tc.json')
// const toolApi = require('../__tests__/fixtures/toolApi.json')
//
// const lexiconCache_ = {};

const styles = {
  containerDiv:{
    display: 'flex',
    flexDirection: 'row',
    // width: '100vw',
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

const Checker = ({
 translate,
}) => {

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

  const mode = 'default';
  const tags = [];
  const commentText = '';
  const verseText = 'The people who do not honor God will disappear, along with all of the things that they desire. But the people who do what God wants them to do will live forever!';
  const selections = [
    {
      "text": "desire",
      "occurrence": 1,
      "occurrences": 1
    }
  ];
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
  const newSelections = [
    {
      "text": "desire",
      "occurrence": 1,
      "occurrences": 1
    }
  ];
  const alignedGLText = 'eternity';
  const handleComment = () => {
    console.log(`${name}-handleComment`)
  }
  const isVerseChanged = false;
  const setToolSettings = () => {
    console.log(`${name}-setToolSettings`)
  }
  const nothingToSelect = false;
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
  const changeSelectionsInLocalState = () => {
    console.log(`${name}-changeSelectionsInLocalState`)
  }
  const toggleNothingToSelect = () => {
    console.log(`${name}-toggleNothingToSelect`)
  }
  const localNothingToSelect = false
  const isCommentChanged = false
  const bookmarkEnabled = false
  const saveSelection = () => {
    console.log(`${name}-saveSelection`)
  }
  const cancelSelection = () => {
    console.log(`${name}-cancelSelection`)
  }
  const clearSelection = () => {
    console.log(`${name}-clearSelection`)
  }
  const toggleBookmark = () => {
    console.log(`${name}-toggleBookmark`)
  }
  const changeMode = () => {
    console.log(`${name}-changeMode`)
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
